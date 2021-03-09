/* eslint-disable no-loop-func */
import Konva from 'konva';

import {
  distance,
  nodeById,
  edgeByParentPiece,
} from './tree';

const createPositionUtils = (
  fontSize,
  fontFamily,
  connectorPlaceholder,
  placeholderWidth,
) => {
  const xPad = fontSize / 2;
  const yPad = fontSize / 2;
  const placeholderMiddle = placeholderWidth / 2;
  const gapWidth = fontSize / 5;

  // Compute the edge's child position having the child node id
  const computeEdgeChildPos = (childNodeId, nodes) => {
    const node = nodeById(childNodeId, nodes);
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
    const node = nodeById(parentNodeId, nodes);
    return {
      x: node.x + xPad + parentPieceX + placeholderMiddle,
      y: node.y + yPad + fontSize,
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
    const totalGapsWidth = 2 * xPad + gapWidth * (pieces.length - 1);
    const totalWidth = piecesWidth.reduce((acc, width) => acc + width, totalGapsWidth);
    return totalWidth;
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
    nodes.forEach((node) => {
      const pos = computeEdgeChildPos(node.id, nodes);
      const dist = distance(pos.x, pos.y, x, y);
      if (dist < fontSize && (!closestDist || dist < closestDist)) {
        closestDist = dist;
        closestNodeId = node.id;
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
    nodes.forEach((node) => {
      const { pieces } = nodeById(node.id, nodes);
      const piecesXCoordinates = computeLabelPiecesXCoordinatePositions(pieces);
      pieces.forEach((piece, i) => {
        if (piece === connectorPlaceholder) {
          const pieceX = piecesXCoordinates[i];
          const pos = computeEdgeParentPos(node.id, pieceX, nodes);
          const dist = distance(pos.x, pos.y, x, y);
          if (dist < fontSize && dist < closestDist) {
            closestDist = dist;
            closestPiece = {
              parentNodeId: node.id,
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

    let orderedChilds = [];
    currentNode.pieces.forEach((piece, i) => {
      if (piece === connectorPlaceholder) {
        const edgesToParent = edgeByParentPiece(currentNode.id, i, edges);
        edgesToParent.forEach((edge) => {
          const childNode = nodeById(edge.childNodeId, nodes);
          if (currentVisitedNodes.find((e) => e === childNode.id) === undefined) {
            orderedChilds = [
              ...orderedChilds,
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
    });

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
        const node = nodeById(currentDepthNodes[0].id, nodes);
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
          const node = nodeById(n.id, nodes);
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
    if (selectedRootNode !== undefined && selectedRootNode !== null) {
      const rootNode = nodeById(selectedRootNode, nodes);
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

      const newNodesState = nodes.map((node) => {
        const foundNode = orderedNodesPositions.find((n) => node.id === n.id);
        if (foundNode !== undefined) {
          return {
            ...foundNode,
          };
        }

        unconnectedCount += 1;
        return {
          ...node,
          x: unconnectedStartingX,
          y: unconnectedStartingY + unconnectedCount * fontSize * 4,
        };
      });

      return newNodesState;
    }

    return nodes;
  };

  // In order tree walk starting from a root node, checking at each step
  // if there is an error to be detected (set with the reportedErrors prop).
  // Returns an array of detected errors used to display the errors alerts,
  // containing the error type, the actual error, and the error location.
  const validateTree = (
    config,
    node,
    nodes,
    edges,
  ) => {
    let visitedNodes = [node.id];
    let visitedBranches = [node.id];
    let currentErrors = [];

    // Missing node type error
    if (node.type === '') {
      if (config
          && config.completenessErrors
          && config.completenessErrors.missingNodeType) {
        const location = `Node ID: ${node.id}`;
        currentErrors.push({
          type: 'Completeness error',
          problem: 'Missing node type',
          location,
          currentErrorLocation: { node: true, nodeId: node.id },
        });
      }
    }
    // Missing node value error
    if (node.value === '') {
      if (config
          && config.completenessErrors
          && config.completenessErrors.missingNodeValue) {
        const location = `Node ID: ${node.id}`;
        currentErrors.push({
          type: 'Completeness error',
          problem: 'Missing node value',
          location,
          currentErrorLocation: { node: true, nodeId: node.id },
        });
      }
    }

    let connectorNum = 0;
    node.pieces.forEach((piece, i) => {
      if (piece === connectorPlaceholder) {
        connectorNum += 1;
        const childEdges = edgeByParentPiece(node.id, i, edges);
        if (childEdges.length > 1) {
          // Multiple edge on single hole connector error
          if (config
              && config.structureErrors
              && config.structureErrors.multiEdgeOnHoleConnector) {
            const location = `Node ID: ${node.id}, connector number: ${connectorNum}`;
            currentErrors.push({
              type: 'Structure error',
              problem: 'Multiple edge on single hole connector',
              location,
              currentErrorLocation: {
                pieceConnector: true,
                nodeId: node.id,
                pieceId: i,
              },
            });
          }
        } else if (childEdges.length === 0) {
          // Empty connector error
          if (config
              && config.completenessErrors
              && config.completenessErrors.emptyPieceConnector) {
            const location = `Node ID: ${node.id}, connector number: ${connectorNum}`;
            currentErrors.push({
              type: 'Completeness error',
              problem: 'Empty connector',
              location,
              currentErrorLocation: {
                pieceConnector: true,
                nodeId: node.id,
                pieceId: i,
              },
            });
          }
        }

        childEdges.forEach((edge) => {
          const childNode = nodeById(edge.childNodeId, nodes);
          let foundError = false;
          // Multiple edge on single node connector error
          if (visitedNodes.find((e) => e === childNode.id) !== undefined) {
            if (config
                && config.structureErrors
                && config.structureErrors.multiEdgeOnNodeConnector) {
              const location = `Node ID: ${childNode.id}`;
              currentErrors.push({
                type: 'Structure error',
                problem: 'Multiple edge on single node connector',
                location,
                currentErrorLocation: {
                  nodeConnector: true,
                  nodeId: childNode.id,
                },
              });
              foundError = true;
            }
          }
          if (visitedBranches.find((e) => e === childNode.id) !== undefined) {
            // Loop error
            if (config
                && config.structureErrors
                && config.structureErrors.loop) {
              const location = ` From node ID: ${
                childNode.id
              }, to nodeID: ${
                node.id
              }, connector number: ${
                connectorNum}`;
              currentErrors.push({
                type: 'Structure error',
                problem: 'Loop detected',
                location,
                currentErrorLocation: { edge: true, edgeId: edge.id },
              });
              foundError = true;
            }
          }
          if (foundError) {
            return [currentErrors, visitedNodes, visitedBranches];
          }

          const [childErrors, childVisitedNodes, childVisitedBranches] = validateTree(
            config,
            childNode,
            nodes,
            edges,
          );

          currentErrors = [
            ...currentErrors,
            ...childErrors,
          ];

          visitedNodes = [
            ...visitedNodes,
            ...childVisitedNodes,
          ];

          visitedBranches = [
            ...visitedBranches,
            ...childVisitedBranches,
          ];
        });
      }
    });

    return [currentErrors, visitedNodes, visitedBranches];
  };

  const sanitizeNodes = (nodes) => {
    const sanitizedNodes = nodes.map((node, i) => ({
      ...node,
      id: node.id || i,
      width: computeNodeWidth(node.pieces),
    }));

    return sanitizedNodes;
  };

  const sanitizeEdges = (edges) => {
    const sanitizedEdges = edges.map((edge, i) => ({
      ...edge,
      id: edge.id || i,
    }));
    return sanitizedEdges;
  };

  return {
    closestChildId,
    closestParentPiece,
    computeEdgeChildPos,
    computeEdgeParentPos,
    computeLabelPiecesXCoordinatePositions,
    computeNodeWidth,
    parseLabelPieces,
    sanitizeNodes,
    sanitizeEdges,
    reorderNodes,
    validateTree,
  };
};

export default createPositionUtils;
