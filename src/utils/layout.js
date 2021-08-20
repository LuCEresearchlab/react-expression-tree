/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable arrow-body-style */
/* eslint-disable arrow-parens */
/* eslint comma-dangle: ["error", {"functions": "never"}] */
/* eslint no-use-before-define: ["error", { "functions": false }] */

/**
 * Layout an ET diagram.
 * The ET diagram consists of two areas, one placed above the other:
 *
 * 1. The forest area
 * 2. The singleton area
 *
 * Every node that has no parent and no children is a "singleton" node.
 * All singleton nodes are placed into the singleton area.
 * The singleton area contains the singleton nodes placed next to each other.
 *
 * Every node that has either a parent, children, or both is part of a (non-singleton) tree.
 * All (non-singleton) trees are placed in the forest area.
 * The forest area contains the trees, one next to the other.
 *
 * Zero or one of the nodes may be a selected tree root.
 * However, it does not matter whether a node is the selected root or not;
 * if a node is part of a tree, then it is shown in the forest.
 *
 * An ET diagram represented as a dictionary of nodes, a dictionary of edges,
 * and a selected root node id.
 * The ID of the root of the selected tree is given as the selectedRootNodeId.
 * However, which root node is selected does not affect the layout.
 *
 * Below is an example ET forest. That forest contains three nodes and two edges,
 * making up a single tree. That tree is selected (its root node is the selected root node)
 *
 * <code>
    const nodes = {
      n0: {
        pieces: ['#', '+', '#'],
        type: 'Number',
        value: '10',
        isFinal: true,
        x: 320,
        y: 90,
      },
      n1: {
        pieces: ['#', '-', '#'],
        type: 'Boolean',
        value: 'true',
        isFinal: false,
        x: 320,
        y: 120,
      },
      n2: {
        pieces: ['#', '/', '#'],
        type: 'Object',
        value: '',
        isFinal: false,
        x: 320,
        y: 150,
      },
    };
    const edges = {
      e0: {
        parentNodeId: 'n0',
        parentPieceId: 0,
        childNodeId: 'n1',
      },
      e1: {
        parentNodeId: 'n0',
        parentPieceId: 2,
        childNodeId: 'n2',
      },
    };
    const selectedRootNodeId ='n0';
 * </code>
 *
 * @author Matthias.Hauswirth@usi.ch
 */

// We want to layout on the server,
// or at least inside JavaScript functions that don't depend on the DOM.
// Can we use Konva to measure Text elements without having a DOM?
// Can we do so even on the server side?
//
// import Konva from 'konva';
// const konvaText = new Konva.Text({text, fontFamily, fontSize});
// return konvaText.getTextWidth();
//
// It seems that Konva can be run in NodeJS
// (maybe that's `konva-node`?)
// https://github.com/konvajs/konva/tree/ff4aae2b02635f9b63ffebd76e45f7b8c333ea5a#4-nodejs-env
// In any case, running Konva in NodeJS requires the `canvas` package.

// --- Layout constants
// constants provided to position.js/createPositionUtils()
// with default values from ExpressionTreeEditor.jsx ExpressionTreeEditor.defaultProps
const nodePaddingX = 12;
const nodePaddingY = 12;
const fontSize = 24;
const placeholderWidth = 16;
const connectorPlaceholder = '{{}}'; // TODO: configurable hole regex
const gapWidth = fontSize / 5;

// constants used in layout computations below
const topMargin = 80;
const leftMargin = 340;
const leftNodePadding = nodePaddingX;
const rightNodePadding = nodePaddingX;
const topNodePadding = nodePaddingY;
const bottomNodePadding = nodePaddingY;
const pieceGap = gapWidth;
const nodeHorizontalGap = 20;
const nodeVerticalGap = 60;
const treeGap = 60;
const forestSingletonsGap = 100;
// Hack: determine the width of a character in a piece
// based on the default font we use.
// This way we can produce a layout on the server,
// without access to the font and the canvas needed to measure text widths.
// new Konva.Text({text: 'X', fontFamily: 'Roboto Mono, Courier', fontSize: 24}).getTextWidth()
const charWidth = 14.40234375;

// --- Structural functions
export function isHolePiece(piece) {
  return piece === connectorPlaceholder;
}

export function getChildIds(nodeId, nodes, edges) {
  return Object.keys(edges)
    .filter(edgeId => edges[edgeId].parentNodeId === nodeId)
    .map(edgeId => edges[edgeId].childNodeId);
}

export function isRootId(nodeId, nodes, edges) {
  return Object.keys(edges).every(edgeId => edges[edgeId].childNodeId !== nodeId);
}

/**
 * Is this the ID of a singleton node (no partent, no children)?
 *
 * @param {*} nodeId the ID of the node
 * @param {*} nodes all nodes
 * @param {*} edges all edges
 * @returns true if the node with nodeId is a singleton node, false otherwise
 */
export function isSingletonId(nodeId, nodes, edges) {
  return Object.keys(edges).every(edgeId =>
    edges[edgeId].childNodeId !== nodeId && edges[edgeId].parentNodeId !== nodeId);
}

export function getRootIds(nodes, edges) {
  return Object.keys(nodes)
    .filter(nodeId => isRootId(nodeId, nodes, edges));
}

export function getNonSingletonRootIds(nodes, edges) {
  return getRootIds(nodes, edges)
    .filter(nodeId => !isSingletonId(nodeId, nodes, edges));
}

export function getSingletonNodeIds(nodes, edges) {
  return Object.keys(nodes)
    .filter(nodeId => isSingletonId(nodeId, nodes, edges));
}

// --- Size computation functions
export function computeTextPieceWidth(piece) {
  return piece.length * charWidth; // TODO: use font metrics
}

export function computeHolePieceWidth(piece) {
  return placeholderWidth; // TODO: add support for typed holes {{int}}
}

export function computePieceWidth(piece) {
  return isHolePiece(piece) ? computeHolePieceWidth(piece) : computeTextPieceWidth(piece);
}

export function computeNodeWidth(nodeId, nodes) {
  const node = nodes[nodeId];
  const width = node.pieces
    .map(piece => computePieceWidth(piece))
    .reduce((totalWidth, pieceWidth) => totalWidth + pieceWidth, 0);
  return leftNodePadding + rightNodePadding + width + node.pieces.length * pieceGap;
}

export function computeNodeHeight(nodeId, nodes) {
  return topNodePadding + 20 + bottomNodePadding; // TODO: use font metrics (instead of 20)
}

export function computeDescendantsWidth(rootId, nodes, edges) {
  return getChildIds(rootId, nodes, edges)
    .reduce(
      (width, childId, index) =>
        (width + computeTreeWidth(childId, nodes, edges) + (index > 0 ? nodeHorizontalGap : 0)),
      0
    );
}

export function computeTreeWidth(rootId, nodes, edges) {
  const myWidth = computeNodeWidth(rootId, nodes);
  const descendantsWidth = computeDescendantsWidth(rootId, nodes, edges);
  return Math.max(myWidth, descendantsWidth);
}

export function computeTreeHeight(rootId, nodes, edges) {
  const myHeight = computeNodeHeight(rootId, nodes);
  const descendantsHeight = getChildIds(rootId, nodes, edges)
    .reduce(
      (height, childId) =>
        Math.max(height, computeTreeHeight(childId, nodes, edges)),
      0
    );
  return myHeight + (descendantsHeight > 0 ? nodeVerticalGap + descendantsHeight : 0);
}

// --- Layout functions (they mutate the nodes!)
export function layoutTree(rootId, nodes, edges, x, y) {
  console.log("layoutTree", rootId, x, y);
  const rootWidth = computeNodeWidth(rootId, nodes);
  console.log("  rootWidth", rootWidth);
  const rootHeight = computeNodeHeight(rootId, nodes);
  console.log("  rootHeight", rootHeight);
  const descendantsWidth = computeDescendantsWidth(rootId, nodes, edges);
  console.log("  descendantsWidth", descendantsWidth);
  const rootIndent = rootWidth > descendantsWidth ? 0 : (descendantsWidth - rootWidth) / 2;
  const descendantsIndent = rootWidth > descendantsWidth ? (rootWidth - descendantsWidth) / 2 : 0;
  let dx = x + descendantsIndent;
  const dy = y + rootHeight + nodeVerticalGap;
  const childIds = getChildIds(rootId, nodes, edges);
  console.log("  childIds", childIds);
  childIds.forEach((childId, index) => {
    const [dw, dh] = layoutTree(childId, nodes, edges, dx, dy);
    dx += dw + (index < childIds.length - 1 ? nodeHorizontalGap : 0);
  });
  const root = nodes[rootId];
  root.x = x + rootIndent;
  root.y = y;
  const width = computeTreeWidth(rootId, nodes, edges);
  const height = computeTreeHeight(rootId, nodes, edges);
  return [width, height];
}

export function placeSingleton(nodeId, nodes, edges, x, y) {
  const node = nodes[nodeId];
  node.x = x;
  node.y = y;
  return [computeNodeWidth(nodeId, nodes), computeNodeHeight(nodeId, nodes)];
}

export function layout(nodes, edges, selectedRootNodeId) {
  // top/left position of the drawing
  const x = leftMargin;
  const y = topMargin;
  // width/height of forest part of the drawing
  let forestWidth = 0;
  let forestHeight = 0;
  getNonSingletonRootIds(nodes, edges).forEach(rootId => {
    const [width, height] = layoutTree(rootId, nodes, edges, x + forestWidth, y);
    forestWidth += width + treeGap;
    forestHeight = Math.max(forestHeight, height);
  });
  // width/height of singletons part of the drawing
  let singletonsWidth = 0;
  let singletonsHeight = 0;
  getSingletonNodeIds(nodes, edges).forEach(nodeId => {
    const [width, height] = placeSingleton(
      nodeId, nodes, edges, x + singletonsWidth, y + forestHeight + forestSingletonsGap
    );
    singletonsWidth += width + nodeHorizontalGap;
    singletonsHeight = Math.max(singletonsHeight, height);
  });
  // return width/height of the drawing
  return [
    Math.max(forestWidth, singletonsWidth),
    forestHeight + forestSingletonsGap + singletonsHeight
  ];
}
