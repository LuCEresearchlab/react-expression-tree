import Konva from 'konva';
import {
  Stage, Layer, Rect, Transformer,
} from 'react-konva';

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import fscreen from 'fscreen';

import { addMetadataFromBase64DataURI } from 'meta-png';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Node from '../Node/Node';
import Edge from '../Edge/Edge';
import DragEdge from '../DragEdge/DragEdge';
import StageDrawer from '../StageDrawer/StageDrawer';

import {
  arraysAreEqual,
  exportState,
} from '../../utils/state';

import {
  checkIsCreatingLoop,
  checkIsMultiEdgeOnParentConnector,
  checkIsMultiEdgeOnChildConnector,
  checkSameNodeTarget,
  checkSamePreviousParent,
  checkSamePreviousChild,
} from '../../utils/addEdge';

import useStore from '../../hooks/useStore';
import useKeypress from '../../hooks/useKeypress';
import useContainerWidthOnWindowResize from '../../hooks/useContainerWidthOnWindowResize';

import { defaultProps } from '../../store/initialState';

import '@fontsource/roboto-mono/300.css';

// Key used to store and retrieve metadata in PNG files.
const ET_KEY = 'expressiontutor';

function ExpressionTreeEditor({
  width,
  height,
  allowedErrors,
  isFullDisabled,
  showToolbar,
  showToolbarButtons,
  showDrawer,
  showDrawerSections,
  reportErrorConfig,
  templateNodes: propTemplateNodes,
  allowFreeTypeUpdate,
  allowFreeValueUpdate,
  templateNodeTypesAndValues,
  connectorPlaceholder: propConnectorPlaceholder,
  nodes: propNodes,
  selectedNode: propSelectedNode,
  edges: propEdges,
  selectedEdge: propSelectedEdge,
  selectedRootNode: propSelectedRootNode,
  stagePos: propStagePos,
  stageScale: propStageScale,
  highlightedEdges: propHighlightedEdges,
  highlightedNodes: propHighlightedNodes,
  // onNodeAdd,
  // onNodeDelete,
  // onNodeSelect,
  // onNodeMove,
  // onNodePiecesChange,
  // onNodeTypeChange,
  // onNodeValueChange,
  // onEdgeAdd,
  // onEdgeDelete,
  // onEdgeUpdate,
  // onEdgeSelect,
  // onValidate,
  containerBorder,
  containerBorderRadius,
  containerBackgroundColor,
  onStateChange,
  fontSize: propFontSize,
  fontFamily: propFontFamily,
  nodePaddingX: propNodePaddingX,
  nodePaddingY: propNodePaddingY,
  placeholderWidth: propPlaceholderWidth,
  dragEdgeStyle,
  edgeStyle,
  nodeStyle,
  selectionRectangleStyle,
  toolbarPrimaryColor,
  toolbarSecondaryColor,
}) {
  const containerRef = useRef();
  const containerWidth = useContainerWidthOnWindowResize(containerRef);

  const stageRef = useRef();
  const layerRef = useRef();
  const selectionRectRef = useRef();
  const selectedRectRef = useRef();
  const transformerRef = useRef();
  const createNodeStageRef = useRef();

  const [store, actions, utils] = useStore({
    propNodes,
    propSelectedNode,
    propEdges,
    propSelectedEdge,
    propSelectedRootNode,
    propStagePos,
    propStageScale,
    propConnectorPlaceholder,
    propPlaceholderWidth,
    propFontSize,
    propFontFamily,
    propNodePaddingX,
    propNodePaddingY,
    propTemplateNodes,
    propHighlightedNodes,
    propHighlightedEdges,
  });

  const {
    fontSize,
    fontFamily,
    nodePaddingX,
    nodePaddingY,
    connectorPlaceholder,
    placeholderWidth,
    isDraggingNode,
    isFullScreen,
    stagePos,
    stageScale,
    nodes,
    selectedNode,
    edges,
    dragEdge,
    selectedEdge,
    selectedRootNode,
    highlightedNodes,
    highlightedEdges,
    templateNodes,
    templateNodesDescription,
    isDrawerOpen,
    isCreatingNode,
    addEdgeErrorMessage,
    isAddEdgeErrorSnackbarOpen,
    isSelectedNodeEditable,
    createNodeDescription,
    createNodeInputValue,
    updateLabelInputValue,
    updateTypeInputValue,
    updateValueInputValue,
    isValidationDialogOpen,
    validationErrors,
    currentError,
    undoState,
    redoState,
  } = store;

  const {
    removeNode,
    updateNodeCoordinates,
    updateNodeCoordinatesAndFinishDragging,
    setDragEdge,
    updateDragEdgeParentCoordinates,
    updateDragEdgeChildCoordinates,
    removeEdge,
    createEdge,
    updateChildEdge,
    updateParentEdge,
    clearDragEdge,

    // Global
    setIsDraggingNode,
    // Drawer
    toggleIsCreatingNode,
    clearIsCreatingNode,
    toggleDrawer,
    setCreateNodeInputValue,
    setUpdateLabelInputValue,
    setAddEdgeErrorSnackbarMessage,
    toggleIsAddEdgeErrorSnackbarOpen,
    setCreateNodeDescription,
    // Stage
    zoomStage,
    zoomStageWheel,
    setStagePos,
    setStagePositionAndScale,
    toggleFullScreen,
    // Tree
    stageReset,
    createNode,
    setSelectedNode,
    clearSelectedNode,
    setSelectedEdge,
    clearSelectedEdge,
    setSelectedRootNode,
    clearSelectedRootNode,
    updateNode,
    updateNodeType,
    updateNodeValue,
    setOrderedNodes,
    // Errors
    closeValidationDialog,
    setValidationErrors,
    setPreviousError,
    setNextError,
    // Undo - Redo
    undo,
    redo,
  } = actions;

  const {
    closestChildId,
    closestParentPiece,
    computeEdgeChildPos,
    computeEdgeParentPos,
    computeLabelPiecesXCoordinatePositions,
    updateEdgeChildCoordinates,
    computeNodeWidth,
    computeNodeHeight,
    parseLabelPieces,
    sanitizeNodesAndEdges,
    computeEdgesCoordinates,
    computeEdgeCoordinates,
    computeEdgeChildCoordinates,
    computeEdgeParentCoordinates,
    reorderNodes,
    validateTree,
    createNodeFromPieces,
  } = utils;

  const computeStageWidth = () => width || containerWidth;

  const handleUpdateLabelPiecesChange = useCallback(() => {
    const pieces = parseLabelPieces(updateLabelInputValue);
    if (!arraysAreEqual(pieces, nodes[selectedNode].pieces)) {
      const piecesPosition = computeLabelPiecesXCoordinatePositions(pieces);
      const nodeWidth = computeNodeWidth(pieces);
      const parentEdges = pieces.reduce((accumulator) => {
        accumulator.push([]);
        return accumulator;
      }, []);

      const connectedEdgesIds = nodes[selectedNode].childEdges;
      const tempNode = {
        ...nodes[selectedNode],
        pieces,
        piecesPosition,
        width: nodeWidth,
      };
      const updatedEdges = updateEdgeChildCoordinates(connectedEdgesIds, edges, tempNode);
      updateNode({
        pieces,
        piecesPosition,
        width: nodeWidth,
        updatedEdges,
        parentEdges,
      });
    }
  });

  const handleUpdateNodeTypeChange = useCallback((value) => {
    updateNodeType(value);
  });

  const handleUpdateNodeValueChange = useCallback((value) => {
    updateNodeValue(value);
  });

  const handleResetState = () => {
    const { sanitizedNodes, sanitizedEdges } = sanitizeNodesAndEdges(propNodes, propEdges);
    stageReset({
      nodes: sanitizedNodes,
      selectedNode: propSelectedNode,
      edges: sanitizedEdges,
      selectedEdge: propSelectedEdge,
      selectedRootNode: propSelectedRootNode,
      stagePos: propStagePos || defaultProps.stagePos,
      stageScale: propStageScale || defaultProps.stageScale,
      connectorPlaceholder: propConnectorPlaceholder || defaultProps.connectorPlaceholder,
    });
  };

  // const hasStateToUndo = undoState.length > 0;
  // const hasStateToRedo = redoState.length > 0;
  const hasStateToUndo = false;
  const hasStateToRedo = false;
  const handleUndoButtonAction = useCallback(() => {
    undo();
  });
  const handleRedoButtonAction = useCallback(() => {
    redo();
  });

  const handleCreateNode = useCallback(() => {
    const pointerPos = stageRef.current.getPointerPosition();
    const newNode = createNodeFromPieces(createNodeInputValue);
    newNode.x = (pointerPos.x - stagePos.x) / stageScale.x;
    newNode.y = (pointerPos.y - stagePos.y) / stageScale.y;
    createNode(newNode);
  });

  const handleZoomOutButtonAction = useCallback(() => {
    zoomStage(0.8);
  });

  const handleZoomInButtonAction = useCallback(() => {
    zoomStage(1.2);
  });

  const handleStageWheel = (e) => {
    e.evt.preventDefault();
    if (isFullDisabled) {
      return;
    }

    const { current } = stageRef;

    const zoomMultiplier = e.evt.deltaY < 0 ? 1.10 : 0.90;
    const oldScale = current.scaleX();
    const newScale = oldScale * zoomMultiplier;

    const pointerPos = current.getPointerPosition();

    const mousePointTo = {
      x: (pointerPos.x - current.x()) / oldScale,
      y: (pointerPos.y - current.y()) / oldScale,
    };

    const newPosition = {
      x: pointerPos.x - mousePointTo.x * newScale,
      y: pointerPos.y - mousePointTo.y * newScale,
    };

    zoomStageWheel({
      stageScale: { x: newScale, y: newScale },
      stagePos: newPosition,
    });
  };

  // Handle zoom to fit and centering button click.
  // The stage scale will be adapted to the ratio between
  // the nodes bounding rectangle and the stage size,
  // then the stage will be repositioned,
  // in order to have all the nodes inside the viewport
  const handleZoomToFitButtonAction = () => {
    const padding = 100;

    const box = layerRef.current.getClientRect({
      relativeTo: stageRef.current,
    });

    const scale = Math.min(
      stageRef.current.width() / (box.width + padding * 2),
      stageRef.current.height() / (box.height + padding * 2),
    );

    const x = -box.x * scale + padding * scale;
    const y = -box.y * scale + padding * scale;

    setStagePositionAndScale({
      stageScale: { x: scale, y: scale },
      stagePos: { x, y },
    });
  };

  const handleReorderNodesButtonAction = useCallback(() => {
    if (selectedRootNode) {
      const orderedNodes = reorderNodes(
        nodes,
        edges,
        selectedRootNode,
      );

      const orderedEdges = computeEdgesCoordinates(edges, orderedNodes);
      const position = { x: 0, y: 0 };
      const scale = { x: 1, y: 1 };

      setOrderedNodes({
        nodes: orderedNodes,
        edges: orderedEdges,
        stagePos: position,
        stageScale: scale,
      });
    }
  });

  const handleValidateTreeButtonAction = useCallback(() => {
    if (selectedRootNode !== undefined && selectedRootNode !== null) {
      const rootNode = nodes[selectedRootNode];
      const [errors] = validateTree(
        reportErrorConfig,
        rootNode,
        nodes,
        edges,
      );
      setValidationErrors(errors);
    }
  });

  const handleUploadStateButtonAction = useCallback(({
    nodes: uploadNodes,
    edges: uploadEdges,
    selectedRootNode: uploadSelectedRootNode,
    stagePos: uploadStagePos,
    stageScale: uploadStageScale,
    connectorPlaceholder: uploadConnectorPlaceholder,
  }) => {
    stageReset({
      nodes: uploadNodes,
      edges: uploadEdges,
      selectedRootNode: uploadSelectedRootNode,
      stagePos: uploadStagePos,
      stageScale: uploadStageScale,
      connectorPlaceholder: uploadConnectorPlaceholder,
    });
  });

  // Prepare the UI for image download (e.g., hiding unwanted nodes).
  // Should be called with inverse is false (default behavior) before downloading,
  // and with inverse === true after the download to reset the status.
  const handlePrepareUIForImageDownload = useCallback((inverse = false) => {
    stageRef.current.find('.deleteButton').visible(inverse);
  });

  // downloading the image of the current visible stage portion
  // Moreover, embed the state in a custom PNG metadata chunk, serializing the current editor state
  // (note: only nodes, edges, placeholder, selected root node, stage position and stage scale
  // are serialized)
  const handleTakeScreenshotButtonAction = useCallback(() => {
    handlePrepareUIForImageDownload();
    const currentState = {
      nodes,
      edges,
      selectedRootNode,
      stagePos,
      stageScale,
      connectorPlaceholder,
    };

    if (typeof document !== 'undefined') {
      const jsonRepr = JSON.stringify(currentState, null, 0);
      const downloadElement = document.createElement('a');
      const boundingBox = layerRef.current.getClientRect();
      const padding = 10; // Add a padding of 10 pixel all around the bounding box
      const imageBase64 = stageRef.current.toCanvas({
        pixelRatio: 2,
        x: boundingBox.x - padding,
        y: boundingBox.y - padding,
        width: boundingBox.width + 2 * padding,
        height: boundingBox.height + 2 * padding,
      }).toDataURL();
      downloadElement.href = addMetadataFromBase64DataURI(imageBase64, ET_KEY, jsonRepr);
      downloadElement.download = 'expression_editor_image.png';
      document.body.appendChild(downloadElement);
      downloadElement.click();
      downloadElement.remove();
      handlePrepareUIForImageDownload(true);
    }
  });

  const handleFullScreenButtonAction = useCallback(() => {
    if (!fscreen.fullscreenElement) {
      fscreen.requestFullscreen(containerRef.current);
      toggleFullScreen();
    } else {
      fscreen.exitFullscreen();
      toggleFullScreen();
    }
  });

  const handleUpdateNodeCoordinates = useCallback((nodeId, x, y) => {
    const node = nodes[nodeId];
    const childEdgeIds = node.childEdges;
    const { parentEdges } = node;

    const updatedNode = {
      ...node,
      x,
      y,
    };

    const updatedEdges = {};
    childEdgeIds.forEach((id) => {
      const { childX, childY } = computeEdgeChildCoordinates(updatedNode);
      updatedEdges[id] = {
        ...edges[id],
        childX,
        childY,
      };
    });
    parentEdges.forEach((pieceEdges, pieceId) => {
      pieceEdges.forEach((id) => {
        const { parentX, parentY } = computeEdgeParentCoordinates(updatedNode, pieceId);
        updatedEdges[id] = {
          ...edges[id],
          parentX,
          parentY,
        };
      });
    });

    return {
      updatedEdges,
      updatedNode,
    };
  });

  useEffect(() => {
    if (createNodeDescription && createNodeStageRef.current) {
      const node = createNodeStageRef.current.findOne('#create-node');
      if (node) {
        const imageBase64 = node.toCanvas({
          pixelRatio: 2,
        }).toDataURL();
      }
    }
  }, [createNodeDescription]);

  useMemo(() => {
    if (templateNodesDescription && createNodeStageRef.current) {
      templateNodesDescription.forEach((templateNode) => {
        // const node = createNodeStageRef.current.findOne(`#${templateNode.id}`);
        const node = createNodeStageRef.current.findOne((n) => {
          console.log(n)
        });
        if (node) {
          const imageBase64 = node.toCanvas({
            pixelRatio: 2,
          }).toDataURL();

          console.log(imageBase64);
        }
      });
    }
  }, [templateNodesDescription]);

  useEffect(() => {
    if (createNodeInputValue === '') {
      setCreateNodeDescription(undefined);
    } else {
      setCreateNodeDescription(createNodeFromPieces(createNodeInputValue));
    }
  }, [createNodeInputValue]);

  useEffect(() => {
    if (stageRef && stageRef.current) {
      stageRef.current.scale(stageScale);
      stageRef.current.batchDraw();
    }
  }, [stageScale]);

  useEffect(() => {
    if (stageRef && stageRef.current) {
      stageRef.current.position(stagePos);
      stageRef.current.batchDraw();
    }
  }, [stagePos]);

  useEffect(() => {
    stageRef.current.find('.Edge').toArray().forEach((edge) => {
      if (edge.attrs && edge.attrs.id === selectedEdge) {
        edge.moveToTop();
      } else {
        edge.moveToBottom();
      }
    });
  }, [selectedEdge]);

  useEffect(() => {
    if (validationErrors.length > 0
        && currentError !== undefined
        && currentError !== null) {
      const errorType = validationErrors[currentError].currentErrorLocation;
      if (errorType.node
          || errorType.pieceConnector
          || errorType.nodeConnector) {
        const currentNode = stageRef.current
          .find('.Node')
          .toArray()
          .find(
            (node) => node.attrs && node.attrs.id === errorType.nodeId,
          );
        currentNode.parent.moveToTop();
      } else if (errorType.edge) {
        const currentEdge = stageRef.current
          .find('.Edge')
          .toArray()
          .find(
            (edge) => edge.attrs && edge.attrs.id === errorType.edgeId,
          );
        currentEdge.moveToTop();
      }
    }
  }, [validationErrors, currentError]);

  // Set the theme primary and secondary colors according to the received props
  const theme = useMemo(() => createMuiTheme({
    palette: {
      primary: { main: toolbarPrimaryColor },
      secondary: { main: toolbarSecondaryColor },
    },
  }), [toolbarPrimaryColor, toolbarSecondaryColor]);

  // State hooks
  const [isDraggingSelectionRect, setIsDraggingSelectionRect] = useState(false);
  const [isSelectingRectVisible, setIsSelectingRectVisible] = useState(false);
  const [isSelectedRectVisible, setIsSelectedRectVisible] = useState(false);
  const [selectionRectStartPos, setSelectionRectStartPos] = useState({
    x: 0,
    y: 0,
  });
  const [selectionRectEndPos, setSelectionRectEndPos] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (onStateChange) onStateChange(exportState(store));
  }, [
    nodes,
    edges,
    selectedRootNode,
    stagePos,
    stageScale,
    connectorPlaceholder,
  ]);

  const setCursor = useCallback((cursor) => {
    containerRef.current.style.cursor = cursor;
  }, []);

  const {
    isBackpasceOrDeleteKeyPressed,
    isEscapedKeyPressed,
  } = useKeypress(containerRef, isFullDisabled);

  const handleConnectorDragStart = useCallback((isParent, nodeId, x, y, pieceId) => {
    if (!isParent) {
      const edgeId = nodes[nodeId].childEdges[0];
      const edge = edges[edgeId];
      if (edge) {
        const parentPieceX = computeLabelPiecesXCoordinatePositions(
          nodes[edge.parentNodeId].pieces,
        )[edge.parentPieceId];
        const parentPos = computeEdgeParentPos(
          edge.parentNodeId,
          parentPieceX,
          nodes,
          fontSize,
          placeholderWidth,
        );
        setDragEdge({
          originalEdgeId: edge.id,
          updateParent: false,
          parentNodeId: edge.parentNodeId,
          parentPieceId: edge.parentPieceId,
          parentX: parentPos.x,
          parentY: parentPos.y - fontSize / 2,
          childX: x,
          childY: y,
        });
      } else {
        setDragEdge({
          originalEdgeId: null,
          updateParent: true,
          childNodeId: nodeId,
          childX: x,
          childY: y,
          parentX: x,
          parentY: y,
        });
      }
    } else {
      const edgeId = nodes[nodeId].parentEdges[pieceId][0];
      const edge = edges[edgeId];
      if (edge) {
        const childPos = computeEdgeChildPos(edge.childNodeId, nodes);
        setDragEdge({
          originalEdgeId: edge.id,
          updateParent: true,
          childNodeId: edge.childNodeId,
          childX: childPos.x,
          childY: childPos.y,
          parentX: x,
          parentY: y,
        });
      } else {
        setDragEdge({
          originalEdgeId: null,
          updateParent: false,
          parentNodeId: nodeId,
          parentPieceId: pieceId,
          parentX: x,
          parentY: y,
          childX: x,
          childY: y,
        });
      }
    }
  });

  const handleConnectorDragMove = useCallback(() => {
    const pointerPos = stageRef.current.getPointerPosition();
    if (dragEdge) {
      if (dragEdge.updateParent) {
        updateDragEdgeParentCoordinates({
          x: (pointerPos.x - stagePos.x) / stageScale.x,
          y: (pointerPos.y - stagePos.y) / stageScale.y,
        });
      } else {
        updateDragEdgeChildCoordinates({
          x: (pointerPos.x - stagePos.x) / stageScale.x,
          y: (pointerPos.y - stagePos.y) / stageScale.y,
        });
      }
    } else if (isDraggingSelectionRect) {
      setSelectionRectEndPos({
        x: (pointerPos.x - stagePos.x) / stageScale.x,
        y: (pointerPos.y - stagePos.y) / stageScale.y,
      });
    }
  });

  const handleConnectorDragEnd = useCallback(() => {
    if (!dragEdge) {
      return;
    }

    const rejectCallback = (error) => {
      if (error.message !== 'No update, target did not change') {
        setAddEdgeErrorSnackbarMessage(error.message);
      } else {
        setAddEdgeErrorSnackbarMessage();
      }
    };

    const fulfillUpdate = (edgeId, edge, isParentUpdate) => {
      const { childNodeId, parentNodeId, parentPieceId } = edge;

      const childNode = nodes[childNodeId];
      const parentNode = nodes[parentNodeId];

      const {
        childX,
        childY,
        parentX,
        parentY,
      } = computeEdgeCoordinates(childNode, parentNode, parentPieceId);

      const updateEdge = isParentUpdate ? updateParentEdge : updateChildEdge;
      updateEdge({
        edgeId,
        newEdge: {
          ...edge,
          childX,
          childY,
          parentX,
          parentY,
        },
      });
    };

    const fulfillNewEdge = (edge) => {
      const { childNodeId, parentNodeId, parentPieceId } = edge;
      const {
        width: nodeWidth,
      } = nodes[childNodeId];
      const {
        pieces: parentPieces,
      } = nodes[parentNodeId];
      const parentPieceX = computeLabelPiecesXCoordinatePositions(parentPieces)[parentPieceId];
      const { x: childX, y: childY } = nodes[childNodeId];
      const { x: parentX, y: parentY } = nodes[parentNodeId];

      createEdge({
        ...edge,
        childX: childX + nodeWidth / 2,
        childY,
        parentX: parentX + nodePaddingX + parentPieceX + placeholderWidth / 2,
        parentY: parentY + nodePaddingY + fontSize / 2,
      });
    };

    const pointerPos = stageRef.current.getPointerPosition();
    const {
      updateParent: isParentTheTarget,
      originalEdgeId: oldEdgeId,
    } = dragEdge;

    if (isParentTheTarget) {
      const targetParentPiece = closestParentPiece(
        (pointerPos.x - stagePos.x) / stageScale.x,
        (pointerPos.y - stagePos.y) / stageScale.y,
        nodes,
      );

      // If the edge already existed
      if (oldEdgeId !== null && oldEdgeId !== undefined) {
        const oldEdge = edges[oldEdgeId];

        // If it does not point to a valid target, remove the edge
        if (targetParentPiece === null || !targetParentPiece === undefined) {
          removeEdge(oldEdgeId);
          return;
        }

        const newEdge = {
          id: oldEdgeId,
          childNodeId: oldEdge.childNodeId,
          parentNodeId: targetParentPiece.parentNodeId,
          parentPieceId: targetParentPiece.parentPieceId,
        };

        checkSamePreviousParent(oldEdge, targetParentPiece)
          .then(() => checkSameNodeTarget(targetParentPiece, dragEdge.childNodeId))
          .then(() => checkIsMultiEdgeOnParentConnector(
            allowedErrors.multiEdgeOnHoleConnector,
            targetParentPiece,
            nodes,
          ))
          .then(() => checkIsCreatingLoop(
            allowedErrors.loop,
            nodes[oldEdge.childNodeId],
            [targetParentPiece.parentNodeId],
            edges,
            nodes,
            connectorPlaceholder,
          ))
          .then(() => fulfillUpdate(oldEdgeId, newEdge, true))
          .catch(rejectCallback);
      } else {
        // If the edge is new and does not point to a target piece, do nothing
        if (targetParentPiece === null || !targetParentPiece === undefined) {
          clearDragEdge();
          return;
        }

        const newEdge = {
          childNodeId: dragEdge.childNodeId,
          parentNodeId: targetParentPiece.parentNodeId,
          parentPieceId: targetParentPiece.parentPieceId,
        };

        checkSameNodeTarget(targetParentPiece, newEdge.childNodeId)
          .then(() => checkIsMultiEdgeOnParentConnector(
            allowedErrors.multiEdgeOnHoleConnector,
            targetParentPiece,
            nodes,
          ))
          .then(() => checkIsCreatingLoop(
            allowedErrors.loop,
            nodes[newEdge.childNodeId],
            [targetParentPiece.parentNodeId],
            edges,
            nodes,
            connectorPlaceholder,
          ))
          .then(() => fulfillNewEdge(newEdge))
          .catch(rejectCallback);
      }
    } else {
      const targetChildId = closestChildId(
        (pointerPos.x - stagePos.x) / stageScale.x,
        (pointerPos.y - stagePos.y) / stageScale.y,
        nodes,
      );

      // If the edge already existed
      if (oldEdgeId !== null && oldEdgeId !== undefined) {
        const oldEdge = edges[oldEdgeId];

        // If it does not point to a valid target, remove the edge
        if (targetChildId === null || targetChildId === undefined) {
          removeEdge(oldEdgeId);
          return;
        }

        const newEdge = {
          id: oldEdgeId,
          parentNodeId: oldEdge.parentNodeId,
          parentPieceId: oldEdge.parentPieceId,
          childNodeId: targetChildId,
        };

        checkSamePreviousChild(oldEdge, targetChildId)
          .then(() => checkSameNodeTarget(oldEdge, targetChildId))
          .then(() => checkIsMultiEdgeOnChildConnector(
            allowedErrors.multiEdgeOnNodeConnector,
            targetChildId,
            nodes,
          ))
          .then(() => checkIsCreatingLoop(
            allowedErrors.loop,
            nodes[targetChildId],
            [oldEdge.parentNodeId],
            edges,
            nodes,
            connectorPlaceholder,
          ))
          .then(() => fulfillUpdate(oldEdgeId, newEdge, false))
          .catch(rejectCallback);
      } else {
        // If it does not point to a valid target, do nothing
        if (targetChildId === null || targetChildId === undefined) {
          clearDragEdge();
          return;
        }

        const newEdge = {
          parentNodeId: dragEdge.parentNodeId,
          parentPieceId: dragEdge.parentPieceId,
          childNodeId: targetChildId,
        };

        checkSameNodeTarget(newEdge, targetChildId)
          .then(() => checkIsMultiEdgeOnChildConnector(
            allowedErrors.multiEdgeOnHoleConnector,
            targetChildId,
            nodes,
          ))
          .then(() => checkIsCreatingLoop(
            allowedErrors.loop,
            nodes[targetChildId],
            [newEdge.parentNodeId],
            edges,
            nodes,
            connectorPlaceholder,
          ))
          .then(() => fulfillNewEdge(newEdge))
          .catch(rejectCallback);
      }
    }
  });

  const handleNodeDragStart = useCallback((e, nodeId) => {
    if (isFullDisabled) {
      return;
    }

    transformerRef.current.nodes([]);
    e.currentTarget.moveToTop();
    setIsDraggingNode(nodeId);
  });

  const handleNodeDragMove = useCallback((e, nodeId) => {
    e.cancelBubble = true;
    if (isFullDisabled) {
      return;
    }

    if (isDraggingNode) {
      const x = e.target.x();
      const y = e.target.y();

      const {
        updatedEdges,
        updatedNode,
      } = handleUpdateNodeCoordinates(nodeId, x, y);

      updateNodeCoordinates({
        updatedEdges,
        nodeId,
        updatedNode,
      });
    }
  });

  const handleNodeDragEnd = useCallback((e, nodeId) => {
    e.cancelBubble = true;
    if (isFullDisabled) {
      return;
    }

    if (isDraggingNode) {
      const x = e.target.x();
      const y = e.target.y();

      const {
        updatedEdges,
        updatedNode,
      } = handleUpdateNodeCoordinates(nodeId, x, y);

      updateNodeCoordinatesAndFinishDragging({
        updatedEdges,
        nodeId,
        updatedNode,
      });
    }
  });

  useEffect(() => {
    if (isBackpasceOrDeleteKeyPressed) {
      if (selectedNode !== null && selectedNode !== undefined) {
        // TODO cannot remove with delete
        // if (!nodes[selectedNode].isFinal) {
        //   removeNode(selectedNode);
        // }
      } else if (selectedEdge !== null && selectedEdge !== undefined) {
        removeEdge(selectedEdge);
      }
    }
  }, [isBackpasceOrDeleteKeyPressed]);

  useEffect(() => {
    if (isEscapedKeyPressed) {
      if (isCreatingNode) {
        clearIsCreatingNode();
      } else if (selectedNode !== undefined && selectedNode !== null) {
        clearSelectedNode();
      } else if (selectedEdge !== undefined && selectedEdge !== null) {
        clearSelectedEdge();
      }
    }
  }, [isEscapedKeyPressed]);

  const handleNodeClick = useCallback((e, nodeId) => {
    e.cancelBubble = true;
    if (isFullDisabled) {
      return;
    }

    transformerRef.current.nodes([]);
    if (isCreatingNode) {
      handleCreateNode();
    } else {
      e.currentTarget.moveToTop();
      const selectingNode = nodes[nodeId];
      if (selectedNode !== selectingNode.id) {
        setSelectedNode(selectingNode.id);
      }
    }
  });

  const handleNodeDblClick = useCallback((nodeId) => {
    if (isFullDisabled) {
      return;
    }

    if (nodeId === selectedRootNode) {
      clearSelectedRootNode();
    } else {
      setSelectedRootNode(nodeId);
    }
  });

  const handleEdgeClick = useCallback((e, edgeId) => {
    if (isFullDisabled) {
      return;
    }

    if (isCreatingNode) {
      handleCreateNode();
    } else {
      e.cancelBubble = true;
      if (selectedEdge === undefined || selectedEdge === null || selectedEdge !== edgeId) {
        setSelectedEdge(edgeId);
      }
    }
  });

  // Handle stage mouse up event adding/updating an edge if we were dragging a DragEdge,
  // otherwise set up the multiple selection created dragging the selection rectangle
  const handleStageMouseUp = (e) => {
    e.cancelBubble = true;
    if (isFullDisabled) {
      return;
    }
    
    const newStagePos = stageRef.current.absolutePosition();
    setStagePos(newStagePos);
  };

  // Handle stage click event, if the adding node button has been pressed,
  // add the new node at the clicked location, otherwise clear all selections
  const handleStageClick = () => {
    if (isFullDisabled) {
      return;
    }

    if (isCreatingNode) {
      handleCreateNode();
    } else {
      transformerRef.current.nodes([]);
      setIsSelectedRectVisible(false);
      if (selectedNode !== undefined || selectedNode !== null) {
        clearSelectedNode();
      }
      if (selectedEdge !== undefined || selectedEdge !== null) {
        clearSelectedEdge();
      }
    }
  };

  // Handle stage mouse down event if we are pressing a meta key,
  // setting up the starting coordinates of the multiple selection rectangle
  const handleStageMouseDown = useCallback((e) => {
    if (isFullDisabled) {
      return;
    }
  });

  // Handle stage drag move event, updating the stage position to the event coordinates
  const handleStageDragMove = (e) => {
    e.cancelBubble = true;
    if (isFullDisabled) {
      return;
    }

    const newPos = e.target.absolutePosition();
    stageRef.current.position({ x: newPos.x, y: newPos.y });
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        ref={containerRef}
        role="tab"
        style={{
          position: 'relative',
          width: width || '100%',
          border: containerBorder,
          borderRadius: containerBorderRadius,
          backgroundColor: containerBackgroundColor,
        }}
        tabIndex={0}
      >
        <StageDrawer
          containerRef={containerRef}
          connectorPlaceholder={connectorPlaceholder}
          downloadKey={ET_KEY}
          isCreatingNode={isCreatingNode}
          isAddEdgeErrorSnackbarOpen={isAddEdgeErrorSnackbarOpen}
          isFullDisabled={isFullDisabled}
          isDrawerOpen={isDrawerOpen}
          isFullScreen={isFullScreen}
          isValidationDialogOpen={isValidationDialogOpen}
          isSelectedNodeEditable={isSelectedNodeEditable}
          createNodeInputValue={createNodeInputValue}
          updateLabelInputValue={updateLabelInputValue}
          updateTypeInputValue={updateTypeInputValue}
          updateValueInputValue={updateValueInputValue}
          showToolbar={showToolbar}
          showToolbarButtons={showToolbarButtons}
          showDrawer={showDrawer}
          showDrawerSections={showDrawerSections}
          templateNodes={templateNodes}
          allowFreeTypeUpdate={allowFreeTypeUpdate}
          allowFreeValueUpdate={allowFreeValueUpdate}
          templateNodeTypesAndValues={templateNodeTypesAndValues}
          hasStateToUndo={hasStateToUndo}
          hasStateToRedo={hasStateToRedo}
          validationErrors={validationErrors}
          currentError={currentError}
          addEdgeErrorMessage={addEdgeErrorMessage}
          closeValidationDialog={closeValidationDialog}
          toggleDrawer={toggleDrawer}
          toggleIsCreatingNode={toggleIsCreatingNode}
          toggleIsAddEdgeErrorSnackbarOpen={toggleIsAddEdgeErrorSnackbarOpen}
          setCreateNodeInputValue={setCreateNodeInputValue}
          setUpdateLabelInputValue={setUpdateLabelInputValue}
          handleResetState={handleResetState}
          handleUpdateLabelPiecesChange={handleUpdateLabelPiecesChange}
          handleUpdateNodeTypeChange={handleUpdateNodeTypeChange}
          handleUpdateNodeValueChange={handleUpdateNodeValueChange}
          handleUndoButtonAction={handleUndoButtonAction}
          handleRedoButtonAction={handleRedoButtonAction}
          handleZoomOutButtonAction={handleZoomOutButtonAction}
          handleZoomInButtonAction={handleZoomInButtonAction}
          handleZoomToFitButtonAction={handleZoomToFitButtonAction}
          handleReorderNodesButtonAction={handleReorderNodesButtonAction}
          handleValidateTreeButtonAction={handleValidateTreeButtonAction}
          handleUploadStateButtonAction={handleUploadStateButtonAction}
          handleTakeScreenshotButtonAction={handleTakeScreenshotButtonAction}
          handleFullScreenButtonAction={handleFullScreenButtonAction}
          setPreviousError={setPreviousError}
          setNextError={setNextError}
          createNodeDescription={createNodeDescription}
          nodeFontSize={fontSize}
          nodeFontFamily={fontFamily}
          nodePaddingX={nodePaddingX}
          nodePaddingY={nodePaddingY}
          nodeStyle={nodeStyle}
        />
        <div>
          {/* Stage component containing the layer component */}
          <Stage
            ref={stageRef}
            width={computeStageWidth()}
            height={height}
            style={{ cursor: isCreatingNode && 'crosshair' }}
            onMouseUp={handleStageMouseUp}
            onTouchEnd={handleStageMouseUp}
            onClick={handleStageClick}
            onTouchStart={handleStageClick}
            draggable={!isFullDisabled}
            onMouseDown={handleStageMouseDown}
            onDragStart={
              !isFullDisabled
              && (() => {
                setCursor('grabbing');
              })
            }
            onDragMove={((e) => handleStageDragMove(e))}
            onDragEnd={
              !isFullDisabled
              && (() => {
                setCursor('move');
              })
            }
            onWheel={handleStageWheel}
          >
            <Layer ref={layerRef}>
              {Object.keys(edges).map((id) => (
                <Edge
                  key={`Edge-${id}`}
                  id={id}
                  childX={edges[id].childX}
                  childY={edges[id].childY}
                  childNodeId={edges[id].childNodeId}
                  parentX={edges[id].parentX}
                  parentY={edges[id].parentY}
                  parentNodeId={edges[id].parentNodeId}
                  parentPieceId={edges[id].parentPieceId}
                  isDragged={dragEdge && dragEdge.originalEdgeId === id}
                  isFullDisabled={isFullDisabled}
                  isDraggingSelectionRect={isDraggingSelectionRect}
                  isSelected={id === selectedEdge}
                  isHighlighted={edges[id].isHighlighted}
                  clearEdgeSelection={clearSelectedEdge}
                  // Event Listeners
                  handleEdgeClick={handleEdgeClick}
                  handleConnectorDragStart={handleConnectorDragStart}
                  handleConnectorDragMove={handleConnectorDragMove}
                  handleConnectorDragEnd={handleConnectorDragEnd}
                  computeLabelPiecesXCoordinatePositions={computeLabelPiecesXCoordinatePositions}
                  setCursor={setCursor}
                  // Style
                  placeholderWidth={placeholderWidth}
                  lineStrokeWidth={edgeStyle.lineStrokeWidth}
                  lineStrokeColor={edgeStyle.lineStrokeColor}
                  lineErrorStrokeColor={edgeStyle.lineErrorStrokeColor}
                  lineSelectedStrokeColor={edgeStyle.lineSelectedStrokeColor}
                  lineDraggingStrokeColor={edgeStyle.lineDraggingStrokeColor}
                  lineHighlightColor={edgeStyle.lineHighlightColor}
                  childConnectorRadiusSize={edgeStyle.childConnectorRadiusSize}
                  childConnectorStrokeColor={edgeStyle.childConnectorStrokeColor}
                  childConnectorStrokeWidth={edgeStyle.childConnectorStrokeWidth}
                  childConnectorFillColor={edgeStyle.childConnectorFillColor}
                  childConnectorSelectedFillColor={edgeStyle.childConnectorSelectedFillColor}
                  childConnectorDraggingFillColor={edgeStyle.childConnectorDraggingFillColor}
                  childConnectorErrorFillColor={edgeStyle.childConnectorErrorFillColor}
                  childConnectorHighlightFillColor={edgeStyle.childConnectorHighlightFillColor}
                  parentConnectorRadiusSize={edgeStyle.parentConnectorRadiusSize}
                  parentConnectorStrokeColor={edgeStyle.parentConnectorStrokeColor}
                  parentConnectorStrokeWidth={edgeStyle.parentConnectorStrokeWidth}
                  parentConnectorFillColor={edgeStyle.parentConnectorFillColor}
                  parentConnectorSelectedFillColor={edgeStyle.parentConnectorSelectedFillColor}
                  parentConnectorDraggingFillColor={edgeStyle.parentConnectorDraggingFillColor}
                  parentConnectorErrorFillColor={edgeStyle.parentConnectorErrorFillColor}
                  parentConnectorHighlightFillColor={edgeStyle.parentConnectorHighlightFillColor}
                />
              ))}
              {/* Map all the state nodes */}
              { Object.keys(nodes).map((id) => (
                <Node
                  key={`Node-${id}`}
                  id={id}
                  labelPieces={nodes[id].pieces}
                  labelPiecesPosition={nodes[id].piecesPosition}
                  positionX={nodes[id].x}
                  positionY={nodes[id].y}
                  typeText={nodes[id].type}
                  valueText={nodes[id].value}
                  childEdges={nodes[id].childEdges}
                  parentEdges={nodes[id].parentEdges}
                  connectorPlaceholder={connectorPlaceholder}
                  placeholderWidth={placeholderWidth}
                  stageRef={stageRef}
                  stageWidth={containerWidth}
                  stageHeight={height}
                  transformerRef={transformerRef}
                  nodeWidth={nodes[id].width}
                  nodeHeight={nodes[id].height}
                  edges={edges}
                  removeNode={removeNode}
                  setCursor={setCursor}
                  isDraggingSelectionRect={isDraggingSelectionRect}
                  isFinal={nodes[id].isFinal}
                  isSelected={id === selectedNode}
                  isSelectedRoot={id === selectedRootNode}
                  isHighlighted={nodes[id].isHighlighted}
                  isFullDisabled={isFullDisabled}
                  handleNodeClick={(e) => handleNodeClick(e, id)}
                  handleNodeDblClick={() => handleNodeDblClick(id)}
                  handleNodeDragStart={(e) => handleNodeDragStart(e, id)}
                  handleNodeDragMove={(e) => handleNodeDragMove(e, id)}
                  handleNodeDragEnd={(e) => handleNodeDragEnd(e, id)}
                  handleConnectorDragStart={handleConnectorDragStart}
                  handleConnectorDragMove={handleConnectorDragMove}
                  handleConnectorDragEnd={handleConnectorDragEnd}
                  fontSize={fontSize}
                  fontFamily={fontFamily}
                  nodePaddingX={nodePaddingX}
                  nodePaddingY={nodePaddingY}
                  nodeStrokeColor={nodeStyle.nodeStrokeColor}
                  nodeStrokeWidth={nodeStyle.nodeStrokeWidth}
                  nodeSelectedStrokeWidth={nodeStyle.nodeSelectedStrokeWidth}
                  nodeHighlightedStrokeWidth={nodeStyle.nodeHighlightedStrokeWidth}
                  nodeCornerRadius={nodeStyle.nodeCornerRadius}
                  nodeFillColor={nodeStyle.nodeFillColor}
                  nodeErrorColor={nodeStyle.nodeErrorColor}
                  nodeSelectedColor={nodeStyle.nodeSelectedColor}
                  nodeFinalColor={nodeStyle.nodeFinalColor}
                  nodeHighlightedColor={nodeStyle.nodeHighlightedColor}
                  labelStyle={nodeStyle.labelStyle}
                  topConnectorStyle={nodeStyle.topConnectorStyle}
                  deleteButtonStyle={nodeStyle.deleteButtonStyle}
                  typeValueStyle={nodeStyle.typeValueStyle}
                />
              ))}
              {/* Multiple selection rectangle component */}
              <Rect
                ref={selectionRectRef}
                x={Math.min(selectionRectStartPos.x, selectionRectEndPos.x)}
                y={Math.min(selectionRectStartPos.y, selectionRectEndPos.y)}
                width={Math.abs(selectionRectEndPos.x - selectionRectStartPos.x)}
                height={Math.abs(selectionRectEndPos.y - selectionRectStartPos.y)}
                fill={selectionRectangleStyle.fillColor}
                visible={isSelectingRectVisible}
              />
              {/* Transformer component attached to the multiple selected nodes */}
              <Transformer
                ref={transformerRef}
                x={
                  transformerRef.current
                  && stageRef.current
                  && (transformerRef.current.getClientRect().x
                    - stageRef.current.absolutePosition().x)
                    / stageRef.current.scale().x
                }
                y={
                  transformerRef.current
                  && stageRef.current
                  && (transformerRef.current.getClientRect().y
                    - stageRef.current.absolutePosition().y)
                    / stageRef.current.scale().y
                }
                rotateEnabled={false}
                resizeEnabled={false}
                visible={isSelectedRectVisible}
              />
              {/* DragEdge component */}
              {dragEdge && (
                <DragEdge
                  key="DragEdge"
                  childX={dragEdge.childX}
                  childY={dragEdge.childY}
                  parentX={dragEdge.parentX}
                  parentY={dragEdge.parentY}
                  lineStrokeWidth={dragEdgeStyle.lineStrokeWidth}
                  lineStrokeColor={dragEdgeStyle.lineStrokeColor}
                  childConnectorRadiusSize={dragEdgeStyle.childConnectorRadiusSize}
                  childConnectorFillColor={dragEdgeStyle.childConnectorFillColor}
                  childConnectorStrokeWidth={dragEdgeStyle.childConnectorStrokeWidth}
                  childConnectorStrokeColor={dragEdgeStyle.childConnectorStrokeColor}
                  parentConnectorRadiusSize={dragEdgeStyle.parentConnectorRadiusSize}
                  parentConnectorFillColor={dragEdgeStyle.parentConnectorFillColor}
                  parentConnectorStrokeWidth={dragEdgeStyle.parentConnectorStrokeWidth}
                  parentConnectorStrokeColor={dragEdgeStyle.parentConnectorStrokeColor}
                />
              )}
            </Layer>
          </Stage>
        </div>
      </div>
      <div style={{ display: 'none' }}>
        <Stage
          ref={createNodeStageRef}
          width={0}
          height={0}
        >
          <Layer>
            {createNodeDescription ? (
              <Node
                id="create-node"
                positionX={0}
                positionY={0}
                labelPieces={createNodeDescription.pieces}
                labelPiecesPosition={createNodeDescription.piecesPosition}
                typeText={createNodeDescription.type}
                valueText={createNodeDescription.value}
                nodeWidth={createNodeDescription.width}
                nodeHeight={createNodeDescription.height}
                childEdges={createNodeDescription.childEdges}
                parentEdges={createNodeDescription.parentEdges}
                isFinal={createNodeDescription.isFinal}
                isSelected={createNodeDescription.isSelected}
                connectorPlaceholder={connectorPlaceholder}
                fontSize={fontSize}
                fontFamily={fontFamily}
                nodePaddingX={nodePaddingX}
                nodePaddingY={nodePaddingY}
                nodeStrokeColor={nodeStyle.nodeStrokeColor}
                nodeStrokeWidth={nodeStyle.nodeStrokeWidth}
                nodeSelectedStrokeWidth={nodeStyle.nodeSelectedStrokeWidth}
                nodeHighlightedStrokeWidth={nodeStyle.nodeHighlightedStrokeWidth}
                nodeCornerRadius={nodeStyle.nodeCornerRadius}
                nodeFillColor={nodeStyle.nodeFillColor}
                nodeErrorColor={nodeStyle.nodeErrorColor}
                nodeSelectedColor={nodeStyle.nodeSelectedColor}
                nodeFinalColor={nodeStyle.nodeFinalColor}
                nodeHighlightedColor={nodeStyle.nodeHighlightedColor}
                labelStyle={nodeStyle.labelStyle}
                topConnectorStyle={nodeStyle.topConnectorStyle}
                deleteButtonStyle={nodeStyle.deleteButtonStyle}
                typeValueStyle={nodeStyle.typeValueStyle}
              />
            ) : null}
            {templateNodesDescription && templateNodesDescription.map((templateNode) => (
              <Node
                key={templateNode.id}
                id={templateNode.id}
                positionX={0}
                positionY={0}
                labelPieces={templateNode.pieces}
                labelPiecesPosition={templateNode.piecesPosition}
                typeText={templateNode.type}
                valueText={templateNode.value}
                nodeWidth={templateNode.width}
                nodeHeight={templateNode.height}
                childEdges={templateNode.childEdges}
                parentEdges={templateNode.parentEdges}
                isFinal={templateNode.isFinal}
                isSelected={templateNode.isSelected}
                connectorPlaceholder={connectorPlaceholder}
                fontSize={fontSize}
                fontFamily={fontFamily}
                nodePaddingX={nodePaddingX}
                nodePaddingY={nodePaddingY}
                nodeStrokeColor={nodeStyle.nodeStrokeColor}
                nodeStrokeWidth={nodeStyle.nodeStrokeWidth}
                nodeSelectedStrokeWidth={nodeStyle.nodeSelectedStrokeWidth}
                nodeHighlightedStrokeWidth={nodeStyle.nodeHighlightedStrokeWidth}
                nodeCornerRadius={nodeStyle.nodeCornerRadius}
                nodeFillColor={nodeStyle.nodeFillColor}
                nodeErrorColor={nodeStyle.nodeErrorColor}
                nodeSelectedColor={nodeStyle.nodeSelectedColor}
                nodeFinalColor={nodeStyle.nodeFinalColor}
                nodeHighlightedColor={nodeStyle.nodeHighlightedColor}
                labelStyle={nodeStyle.labelStyle}
                topConnectorStyle={nodeStyle.topConnectorStyle}
                deleteButtonStyle={nodeStyle.deleteButtonStyle}
                typeValueStyle={nodeStyle.typeValueStyle}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </ThemeProvider>
  );
}

ExpressionTreeEditor.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  allowedErrors: PropTypes.shape({
    loop: PropTypes.bool,
    multiEdgeOnHoleConnector: PropTypes.bool,
    multiEdgeOnNodeConnector: PropTypes.bool,
  }),
  isFullDisabled: PropTypes.bool,
  reportErrorConfig: PropTypes.shape({
    structureErrors: {
      loop: PropTypes.bool,
      multiEdgeOnHoleConnector: PropTypes.bool,
      multiEdgeOnNodeConnector: PropTypes.bool,
    },
    completenessErrors: {
      emptyPieceConnector: PropTypes.bool,
      missingNodeType: PropTypes.bool,
      missingNodeValue: PropTypes.bool,
    },
  }),
  showToolbar: PropTypes.bool,
  showToolbarButtons: PropTypes.shape({
    showDrawerButton: PropTypes.bool,
    showEditorInfoButton: PropTypes.bool,
    showStateResetButton: PropTypes.bool,
    showUndoButton: PropTypes.bool,
    showRedoButton: PropTypes.bool,
    showZoomOutButton: PropTypes.bool,
    showZoomInButton: PropTypes.bool,
    showZoomToFitButton: PropTypes.bool,
    showReorderNodesButton: PropTypes.bool,
    showValidateTreeButton: PropTypes.bool,
    showUploadStateButton: PropTypes.bool,
    showTakeScreenshotButton: PropTypes.bool,
    showFullScreenButton: PropTypes.bool,
  }),
  showDrawer: PropTypes.bool,
  showDrawerSections: PropTypes.shape({
    addNodeField: PropTypes.bool,
    templateDropdown: PropTypes.bool,
    editLabelField: PropTypes.bool,
    editValueField: PropTypes.bool,
    editTypeField: PropTypes.bool,
  }),
  templateNodes: PropTypes.arrayOf(PropTypes.string),
  allowFreeTypeUpdate: PropTypes.bool,
  allowFreeValueUpdate: PropTypes.bool,
  templateNodeTypesAndValues: PropTypes.shape({}),
  connectorPlaceholder: PropTypes.string,
  nodes: PropTypes.objectOf(PropTypes.shape({
    pieces: PropTypes.arrayOf(PropTypes.string),
    x: PropTypes.number,
    y: PropTypes.number,
    type: PropTypes.string,
    value: PropTypes.string,
    isFinal: PropTypes.bool,
  })),
  selectedNode: PropTypes.number,
  edges: PropTypes.objectOf(PropTypes.shape({

  })),
  selectedEdge: PropTypes.number,
  selectedRootNode: PropTypes.number,
  stagePos: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  stageScale: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  highlightedEdges: PropTypes.arrayOf(PropTypes.string),
  highlightedNodes: PropTypes.arrayOf(PropTypes.string),
  // onNodeAdd: PropTypes.func,
  // onNodeDelete: PropTypes.func,
  // onNodeSelect: PropTypes.func,
  // onNodeMove: PropTypes.func,
  // onNodePiecesChange: PropTypes.func,
  // onNodeTypeChange: PropTypes.func,
  // onNodeValueChange: PropTypes.func,
  // onEdgeAdd: PropTypes.func,
  // onEdgeDelete: PropTypes.func,
  // onEdgeUpdate: PropTypes.func,
  // onEdgeSelect: PropTypes.func,
  // onValidate: PropTypes.func,
  onStateChange: PropTypes.func,

  /**
   * Style object for the dragEdge element
   */
  fontSize: PropTypes.number,
  fontFamily: PropTypes.string,
  nodePaddingX: PropTypes.number,
  nodePaddingY: PropTypes.number,
  placeholderWidth: PropTypes.number,
  containerBorder: PropTypes.string,
  containerBorderRadius: PropTypes.string,
  containerBackgroundColor: PropTypes.string,
  toolbarStyle: PropTypes.exact({
    primaryColor: PropTypes.string,
    secondaryColor: PropTypes.string,
  }),
  dragEdgeStyle: PropTypes.exact({
    lineStrokeWidth: PropTypes.number,
    lineStrokeColor: PropTypes.string,
    childConnectorRadiusSize: PropTypes.number,
    childConnectorFillColor: PropTypes.string,
    childConnectorStrokeWidth: PropTypes.number,
    childConnectorStrokeColor: PropTypes.string,
    parentConnectorRadiusSize: PropTypes.number,
    parentConnectorFillColor: PropTypes.string,
    parentConnectorStrokeWidth: PropTypes.number,
    parentConnectorStrokeColor: PropTypes.string,
  }),
  edgeStyle: PropTypes.exact({
    lineStrokeWidth: PropTypes.number,
    lineStrokeColor: PropTypes.string,
    lineErrorStrokeColor: PropTypes.string,
    lineSelectedStrokeColor: PropTypes.string,
    lineDraggingStrokeColor: PropTypes.string,
    lineHighlightColor: PropTypes.string,
    childConnectorRadiusSize: PropTypes.number,
    childConnectorStrokeColor: PropTypes.string,
    childConnectorStrokeWidth: PropTypes.number,
    childConnectorFillColor: PropTypes.string,
    childConnectorEmptyFillColor: PropTypes.string,
    childConnectorSelectedFillColor: PropTypes.string,
    childConnectorDraggingFillColor: PropTypes.string,
    childConnectorErrorFillColor: PropTypes.string,
    childConnectorHighlightFillColor: PropTypes.string,
    parentConnectorRadiusSize: PropTypes.number,
    parentConnectorStrokeColor: PropTypes.string,
    parentConnectorStrokeWidth: PropTypes.number,
    parentConnectorFillColor: PropTypes.string,
    parentConnectorEmptyFillColor: PropTypes.string,
    parentConnectorSelectedFillColor: PropTypes.string,
    parentConnectorDraggingFillColor: PropTypes.string,
    parentConnectorErrorFillColor: PropTypes.string,
    parentConnectorHighlightFillColor: PropTypes.string,
  }),
  nodeStyle: PropTypes.exact({
    nodeStrokeColor: PropTypes.string,
    nodeStrokeWidth: PropTypes.number,
    nodeSelectedStrokeWidth: PropTypes.number,
    nodeHighlightedStrokeWidth: PropTypes.number,
    nodeCornerRadius: PropTypes.number,
    nodeFillColor: PropTypes.string,
    nodeErrorColor: PropTypes.string,
    nodeSelectedColor: PropTypes.string,
    nodeFinalColor: PropTypes.string,
    nodeHighlightedColor: PropTypes.string,
    labelStyle: PropTypes.exact({
      nodeTextColor: PropTypes.string,
      placeholderStrokeWidth: PropTypes.number,
      placeholderStrokeColor: PropTypes.string,
      placeholderFillColor: PropTypes.string,
      placeholderErrorColor: PropTypes.string,
      placeholderRadius: PropTypes.number,
      connectorRadiusSize: PropTypes.number,
      connectorStrokeWidth: PropTypes.number,
      connectorFillColor: PropTypes.string,
      connectorStrokeColor: PropTypes.string,
    }),
    topConnectorStyle: PropTypes.exact({
      starNumPoints: PropTypes.number,
      starInnerRadius: PropTypes.number,
      starOuterRadius: PropTypes.number,
      starStrokeColor: PropTypes.string,
      starStrokeWidth: PropTypes.number,
      connectorRadius: PropTypes.number,
      connectorStrokeColor: PropTypes.string,
      connectorStrokeWidth: PropTypes.number,
      connectorFillColor: PropTypes.string,
      connectorErrorColor: PropTypes.string,
      connectorSelectedColor: PropTypes.string,
      connectorEmptyFillColor: PropTypes.string,
    }),
    deleteButtonStyle: PropTypes.exact({
      strokeWidth: PropTypes.number,
      radius: PropTypes.number,
      strokeColor: PropTypes.string,
      fillColor: PropTypes.string,
      textColor: PropTypes.string,
      overStrokeColor: PropTypes.string,
      overFillColor: PropTypes.string,
      overTextColor: PropTypes.string,
    }),
    typeValueStyle: PropTypes.exact({
      strokeWidth: PropTypes.number,
      radius: PropTypes.number,
      padding: PropTypes.number,
      textColor: PropTypes.string,
      fillColor: PropTypes.string,
      strokeColor: PropTypes.string,
      pointerDirection: PropTypes.string,
      pointerWidth: PropTypes.number,
      pointerHeight: PropTypes.number,
    }),
  }),
  selectionRectangleStyle: PropTypes.exact({
    fillColor: PropTypes.string,
  }),
  toolbarPrimaryColor: PropTypes.string,
  toolbarSecondaryColor: PropTypes.string,
};

ExpressionTreeEditor.defaultProps = {
  width: null,
  height: '300px',
  allowedErrors: {
    loop: true,
    multiEdgeOnHoleConnector: true,
    multiEdgeOnNodeConnector: true,
  },
  isFullDisabled: false,
  reportErrorConfig: {
    structureErrors: {
      loop: true,
      multiEdgeOnHoleConnector: true,
      multiEdgeOnNodeConnector: true,
    },
    completenessErrors: {
      emptyPieceConnector: true,
      missingNodeType: true,
      missingNodeValue: true,
    },
  },
  showToolbar: true,
  showToolbarButtons: {
    showDrawerButton: true,
    showEditorInfoButton: true,
    showStateResetButton: true,
    showUndoButton: true,
    showRedoButton: true,
    showZoomOutButton: true,
    showZoomInButton: true,
    showZoomToFitButton: true,
    showReorderNodesButton: true,
    showValidateTreeButton: true,
    showUploadStateButton: true,
    showTakeScreenshotButton: true,
    showFullScreenButton: true,
  },
  showDrawer: true,
  showDrawerSections: {
    addNodeField: true,
    templateDropdown: true,
    editLabelField: true,
    editValueField: true,
    editTypeField: true,
  },
  templateNodes: undefined,
  allowFreeTypeUpdate: true,
  allowFreeValueUpdate: true,
  templateNodeTypesAndValues: undefined,
  connectorPlaceholder: defaultProps.connectorPlaceholder,
  nodes: defaultProps.nodes,
  selectedNode: undefined,
  edges: defaultProps.edges,
  selectedEdge: undefined,
  selectedRootNode: undefined,
  stagePos: defaultProps.stagePos,
  stageScale: defaultProps.stageScale,
  highlightedEdges: [],
  highlightedNodes: [],
  // onNodeAdd: null,
  // onNodeDelete: null,
  // onNodeSelect: null,
  // onNodeMove: null,
  // onNodePiecesChange: null,
  // onNodeTypeChange: null,
  // onNodeValueChange: null,
  // onEdgeAdd: null,
  // onEdgeDelete: null,
  // onEdgeUpdate: null,
  // onEdgeSelect: null,
  // onValidate: null,
  onStateChange: null,
  fontSize: 24,
  fontFamily: 'Roboto Mono, Courier',
  nodePaddingX: 12,
  nodePaddingY: 12,
  placeholderWidth: 16,
  containerBorder: '1px solid #aaa',
  containerBorderRadius: '5px',
  containerBackgroundColor: 'white',
  dragEdgeStyle: {},
  edgeStyle: {},
  toolbarStyle: {},
  nodeStyle: {},
  selectionRectangleStyle: {},
  toolbarPrimaryColor: '#3F51B5',
  toolbarSecondaryColor: '#F44336',
};

export default ExpressionTreeEditor;
