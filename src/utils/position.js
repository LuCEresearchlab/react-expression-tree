/* eslint-disable no-loop-func */
import Konva from 'konva';
import { createEmptyEdge, createEmptyNode } from './state';

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

const createPositionUtils = (
  fontSize,
  fontFamily,
  connectorPlaceholder,
  placeholderWidth,
  nodePaddingX,
  nodePaddingY,
) => {
  const placeholderMiddle = placeholderWidth / 2;
  const gapWidth = fontSize / 5;

  // Compute the edge's child position having the child node id
  const computeEdgeChildPos = (childNodeId, nodes) => {
    const node = nodes[childNodeId];
    return {
      x: node.x + node.width / 2,
      y: node.y,
    };
  };

  // Compute the edge's parent position having the parent node and the parent piece ids,
  const computeEdgeParentPos = (
    parentNodeId,
    parentPieceX,
    nodes,
  ) => {
    const node = nodes[parentNodeId];
    return {
      x: node.x + nodePaddingX + parentPieceX + placeholderMiddle,
      y: node.y + nodePaddingY + fontSize,
    };
  };

  // Compute a labele piece width
  const computePieceWidth = (text) => {
    if (text === connectorPlaceholder) {
      return placeholderWidth;
    }
    const konvaText = new Konva.Text({
      text,
      fontFamily,
      fontSize,
    });

    return konvaText.getTextWidth();
  };

  // Compute all the label pieces width
  const computePiecesWidth = (pieces) => pieces.map(computePieceWidth);

  // Compute all the label pieces X coordinate positions
  const computeLabelPiecesXCoordinatePositions = (
    pieces,
  ) => {
    const labelPiecesWidth = computePiecesWidth(pieces);
    let pieceX = 0;
    const xes = labelPiecesWidth.map((w) => {
      const myX = pieceX;
      pieceX += w + gapWidth;
      return myX;
    });
    return xes;
  };

  // Compute the node width
  const computeNodeWidth = (
    pieces,
  ) => {
    const piecesWidth = computePiecesWidth(pieces);
    const totalGapsWidth = 2 * nodePaddingX + gapWidth * (pieces.length - 1);
    const totalWidth = piecesWidth.reduce((acc, width) => acc + width, totalGapsWidth);
    return totalWidth;
  };

  const computeNodeHeight = (
    isEquation,
  ) => {
    if (isEquation) {
      // TODO change this value in the future to allow different heights
      return 2 * nodePaddingY + fontSize;
    }

    return 2 * nodePaddingY + fontSize;
  };

  // Parse the nodes's pieces from a textfield string into the pieces array
  const parseLabelPieces = (label) => {
    const splittedArray = label.split(connectorPlaceholder);
    // TODO this is a temporary solution, there must be a better way to do this.
    const labelPieces = splittedArray.reduce((acc, piece, index) => {
      if (index === splittedArray.length - 1) {
        acc.push(piece);
      } else {
        acc.push(piece);
        acc.push(connectorPlaceholder);
      }
      return acc;
    }, []);
    return labelPieces;
  };

  // Compute the closest child notd given an (x, y) point coordinate
  const closestChildId = (
    x,
    y,
    nodes,
  ) => {
    let closestNodeId = null;
    let closestDist = null;
    Object.keys(nodes).forEach((id) => {
      const pos = computeEdgeChildPos(id, nodes);
      const dist = distance(pos.x, pos.y, x, y);
      if (dist < fontSize && (!closestDist || dist < closestDist)) {
        closestDist = dist;
        closestNodeId = id;
      }
    });
    return closestNodeId;
  };

  // Compute the closest parent piece given an (x, y) point coordinate
  const closestParentPiece = (
    x,
    y,
    nodes,
  ) => {
    let closestPiece = null;
    let closestDist = Number.MAX_VALUE;
    Object.keys(nodes).forEach((id) => {
      const { pieces } = nodes[id];
      const piecesXCoordinates = computeLabelPiecesXCoordinatePositions(pieces);
      pieces.forEach((piece, i) => {
        if (piece === connectorPlaceholder) {
          const pieceX = piecesXCoordinates[i];
          const pos = computeEdgeParentPos(id, pieceX, nodes);
          const dist = distance(pos.x, pos.y, x, y);
          if (dist < fontSize && dist < closestDist) {
            closestDist = dist;
            closestPiece = {
              parentNodeId: id,
              parentPieceId: i,
            };
          }
        }
      });
    });
    return closestPiece;
  };

  const reorderChildNodes = (
    currentNode,
    nodes,
    edges,
    previouslyVisitedNodes,
    previousTreeDepth,
  ) => {
    const currentTreeDepth = previousTreeDepth + 1;

    const currentVisitedNodes = [
      ...previouslyVisitedNodes,
      currentNode.id,
    ];

    const orderedChilds = currentNode.pieces.reduce((accumulator, piece, pieceId) => {
      if (piece === connectorPlaceholder) {
        const edgesToParentIds = nodes[currentNode.id].parentEdges[pieceId];
        const edgesToParent = edgesToParentIds.map((id) => edges[id]);
        edgesToParent.forEach((edge) => {
          const childNode = nodes[edge.childNodeId];
          if (currentVisitedNodes.find((e) => e === childNode.id) === undefined) {
            accumulator = [
              ...accumulator,
              ...reorderChildNodes(
                childNode,
                nodes,
                edges,
                currentVisitedNodes,
                currentTreeDepth,
              ),
            ];
          }
        });
      }
      return accumulator;
    }, []);

    return [
      {
        id: currentNode.id,
        depth: previousTreeDepth,
      },
      ...orderedChilds,
    ];
  };

  const computeOrderedPositions = (
    startingX,
    startingY,
    spaceBetweenNodes,
    orderedNodes,
    nodes,
  ) => {
    const orderedNodesPositions = [];
    let depth = 0;
    let currentDepthNodes = orderedNodes.filter((n) => (n.depth === depth));
    while (currentDepthNodes.length > 0) {
      if (depth === 0) {
        const node = nodes[currentDepthNodes[0].id];
        orderedNodesPositions.push({
          ...node,
          x: startingX - (node.width / 2),
          y: startingY,
        });
      } else {
        const nodeReference = [];
        const relativeNodePosition = [0];
        let totalLevelWidth = 0;
        currentDepthNodes.forEach((n, index) => {
          const node = nodes[n.id];
          nodeReference.push(node);
          if (index !== currentDepthNodes.length - 1) {
            relativeNodePosition.push(relativeNodePosition[index]
              + node.width + spaceBetweenNodes);
            totalLevelWidth += node.width + spaceBetweenNodes;
          } else {
            relativeNodePosition.push(relativeNodePosition[index]
              + node.width);
            totalLevelWidth += node.width;
          }
        });

        const levelStartingX = startingX - (totalLevelWidth / 2);
        currentDepthNodes.forEach((n, index) => {
          orderedNodesPositions.push({
            ...nodeReference[index],
            x: levelStartingX + relativeNodePosition[index],
            y: startingY + (depth * 100),
          });
        });
      }

      depth += 1;
      currentDepthNodes = orderedNodes.filter((n) => (n.depth === depth));
    }

    return orderedNodesPositions;
  };

  const reorderNodes = (
    nodes,
    edges,
    selectedRootNode,
  ) => {
    if (selectedRootNode === undefined || selectedRootNode === null) {
      return nodes;
    }

    const rootNode = nodes[selectedRootNode];
    const orderedNodes = reorderChildNodes(
      rootNode,
      nodes,
      edges,
      [],
      0,
    );

    const startingX = 550;
    const startingY = 100;
    const spaceBetweenNodes = 50;
    const orderedNodesPositions = computeOrderedPositions(
      startingX,
      startingY,
      spaceBetweenNodes,
      orderedNodes,
      nodes,
    );

    const unconnectedStartingX = 50;
    const unconnectedStartingY = 400;
    let unconnectedCount = 0;

    const newNodesState = Object.keys(nodes).reduce((accumulator, id) => {
      const foundNode = orderedNodesPositions.find((n) => id === n.id);
      if (foundNode !== undefined) {
        accumulator[id] = {
          ...foundNode,
        };
      } else {
        unconnectedCount += 1;
        accumulator[id] = {
          ...nodes[id],
          x: unconnectedStartingX,
          y: unconnectedStartingY + unconnectedCount * fontSize * 4,
        };
      }
      return accumulator;
    }, {});

    return newNodesState;
  };

  const computeEdgeChildCoordinates = (childNode) => {
    const {
      width: childWidth,
    } = childNode;

    let { x: childX, y: childY } = childNode;

    childX += childWidth / 2;

    return {
      childX,
      childY,
    };
  };

  const computeEdgeParentCoordinates = (parentNode, parentPieceId) => {
    const {
      pieces: parentPieces,
    } = parentNode;
    const parentPieceX = computeLabelPiecesXCoordinatePositions(parentPieces)[parentPieceId];

    let { x: parentX, y: parentY } = parentNode;

    parentX += nodePaddingX + parentPieceX + placeholderWidth / 2;
    parentY += nodePaddingY + fontSize / 2;

    return {
      parentX,
      parentY,
    };
  };

  const computeEdgeCoordinates = (childNode, parentNode, parentPieceId) => {
    const { childX, childY } = computeEdgeChildCoordinates(childNode);
    const { parentX, parentY } = computeEdgeParentCoordinates(parentNode, parentPieceId);

    return {
      childX,
      childY,
      parentX,
      parentY,
    };
  };

  const computeEdgesCoordinates = (edges, nodes) => (
    Object.keys(edges).reduce((accumulator, id) => {
      const {
        childNodeId,
        parentNodeId,
        parentPieceId,
      } = edges[id];

      const childNode = nodes[childNodeId];
      const parentNode = nodes[parentNodeId];

      const {
        childX,
        childY,
        parentX,
        parentY,
      } = computeEdgeCoordinates(childNode, parentNode, parentPieceId);

      accumulator[id] = {
        ...edges[id],
        id,
        childX,
        childY,
        parentX,
        parentY,
      };
      return accumulator;
    }, {})
  );

  const convertArrayNodesToObject = (nodes) => {
    const objectNodes = {};
    nodes.forEach((node) => {
      const id = `_${node.id}`;
      const {
        pieces,
        x,
        y,
        type,
        value,
        isFinal,
      } = node;

      objectNodes[id] = {
        id,
        x,
        y,
        type,
        value,
        isFinal,
        pieces,
      };
    });
    return objectNodes;
  };

  const convertArrayEdgesToObject = (edges) => {
    const objectEdges = {};
    edges.forEach((edge) => {
      const newEdge = createEmptyEdge(edge.id);
      const { id } = newEdge;

      const {
        parentNodeId,
        parentPieceId,
        childNodeId,
      } = edge;

      objectEdges[id] = {
        ...newEdge,
        parentNodeId: `_${parentNodeId}`,
        parentPieceId,
        childNodeId: `_${childNodeId}`,
      };
    });

    return objectEdges;
  };

  const sanitizeNodesAndEdges = (nodes, edges) => {
    if (Array.isArray(nodes)) {
      nodes = convertArrayNodesToObject(nodes);
    }

    const sanitizedNodes = Object.keys(nodes).reduce((accumulator, id) => {
      const newNode = createEmptyNode(id);
      accumulator[id] = {
        ...newNode,
        ...nodes[id],
        height: computeNodeHeight(nodes[id].isEquation),
        width: computeNodeWidth(nodes[id].pieces),
        piecesPosition: computeLabelPiecesXCoordinatePositions(nodes[id].pieces),
        childEdges: [],
        parentEdges: [],
      };

      nodes[id].pieces.forEach(() => accumulator[id].parentEdges.push([]));
      return accumulator;
    }, {});

    if (Array.isArray(edges)) {
      edges = convertArrayEdgesToObject(edges);
    }

    const sanitizedEdges = computeEdgesCoordinates(edges, sanitizedNodes);

    Object.keys(sanitizedEdges).forEach((id) => {
      const {
        childNodeId,
        parentNodeId,
        parentPieceId,
      } = edges[id];

      if (sanitizedNodes[childNodeId]) {
        sanitizedNodes[childNodeId].childEdges.push(id);
      }
      if (sanitizedNodes[parentNodeId]
          && sanitizedNodes[parentNodeId].parentEdges[parentPieceId]) {
        sanitizedNodes[parentNodeId].parentEdges[parentPieceId].push(id);
      }
    });

    return { sanitizedNodes, sanitizedEdges };
  };

  const updateEdgeChildCoordinates = (edgeIds, edges, childNode) => {
    const updatedEdges = edgeIds.reduce((accumulator, id) => {
      const {
        childX,
        childY,
      } = computeEdgeChildCoordinates(childNode);

      accumulator[id] = {
        ...edges[id],
        id,
        childX,
        childY,
      };
      return accumulator;
    }, {});

    return updatedEdges;
  };

  const createNodeFromPieces = (pieces, id) => {
    const newNode = createEmptyNode(id);

    const labelPieces = parseLabelPieces(pieces);
    const labelPiecesPosition = computeLabelPiecesXCoordinatePositions(labelPieces);
    const nodeWidth = computeNodeWidth(labelPieces);
    const nodeHeight = computeNodeHeight(false);
    const parentEdges = labelPieces.reduce((accumulator) => {
      accumulator.push([]);
      return accumulator;
    }, []);

    return {
      ...newNode,
      height: nodeHeight,
      width: nodeWidth,
      pieces: labelPieces,
      piecesPosition: labelPiecesPosition,
      parentEdges,
    };
  };

  return {
    createNodeFromPieces,
    closestChildId,
    closestParentPiece,
    computeEdgeChildPos,
    computeEdgeParentPos,
    computeLabelPiecesXCoordinatePositions,
    updateEdgeChildCoordinates,
    computeNodeHeight,
    computeNodeWidth,
    parseLabelPieces,
    sanitizeNodesAndEdges,
    computeEdgesCoordinates,
    computeEdgeCoordinates,
    computeEdgeChildCoordinates,
    computeEdgeParentCoordinates,
    reorderNodes,
  };
};

export default createPositionUtils;
