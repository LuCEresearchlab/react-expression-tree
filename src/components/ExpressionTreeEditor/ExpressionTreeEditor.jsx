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
  edgeByChildNode,
  edgeByParentPiece,
  edgeById,
  nodeById,
  nodePositionById,
} from '../../utils/tree';

import {
  maxNodeId,
  exportState,
} from '../../utils/state';

import {
  checkIsCreatingLoop,
  checkIsMultiEdgeOnHoleConnector,
  checkIsMultiEdgeOnNodeConnector,
  checkSameNodeTarget,
  checkSamePreviousParent,
  checkSamePreviousChild,
} from '../../utils/addEdge';

import useStore from '../../hooks/useStore';
import useKeypress from '../../hooks/useKeypress';
import useContainerWidthOnWindowResize from '../../hooks/useContainerWidthOnWindowResize';

import defaultStyle from '../../style/default.json';

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
  templateNodes,
  allowFreeTypeEdit,
  allowFreeValueEdit,
  templateNodeTypesAndValues,
  connectorPlaceholder: propConnectorPlaceholder,
  nodes: propNodes,
  selectedNode: propSelectedNode,
  edges: propEdges,
  selectedEdge: propSelectedEdge,
  selectedRootNode: propSelectedRootNode,
  stagePos: propStagePos,
  stageScale: propStageScale,
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
  onStateChange,
  style,
}) {
  const containerRef = useRef();
  const containerWidth = useContainerWidthOnWindowResize(containerRef);

  const stageRef = useRef();
  const layerRef = useRef();
  const selectionRectRef = useRef();
  const selectedRectRef = useRef();
  const transformerRef = useRef();

  const { fontSize: propFontSize, fontFamily: propFontFamily } = style;
  const { width: propPlaceholderWidth } = style.node.placeholder;

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
  });

  const {
    fontSize,
    // fontFamily,
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
    isDrawerOpen,
    isCreatingNode,
    addEdgeErrorMessage,
    isAddEdgeErrorSnackbarOpen,
    isSelectedNodeEditable,
    createNodeInputValue,
    editLabelInputValue,
    editTypeInputValue,
    editValueInputValue,
    isValidationDialogOpen,
    validationErrors,
    currentError,
  } = store;

  const {
    removeNode,
    moveNodeTo,
    moveNodeToEnd,
    setDragEdge,
    moveDragEdgeParentEndTo,
    moveDragEdgeChildEndTo,
    removeEdge,
    addEdge,
    updateEdge,
    clearDragEdge,
    moveSelectedNodesTo,
    moveSelectedNodesToEnd,

    // Global
    setIsDraggingNode,
    // Drawer
    toggleIsCreatingNode,
    clearIsCreatingNode,
    toggleDrawer,
    setCreateNodeInputValue,
    setEditLabelInputValue,
    setEditTypeInputValue,
    setEditValueInputValue,
    setAddEdgeErrorSnackbarMessage,
    toggleIsAddEdgeErrorSnackbarOpen,
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
    editNode,
    editNodeType,
    editNodeValue,
    setOrderedNodes,
    // Errors
    closeValidationDialog,
    setValidationErrors,
    setPreviousError,
    setNextError,
  } = actions;

  const {
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
  } = utils;

  const computeStageWidth = () => width || containerWidth;

  const handleEditLabelPiecesChange = useCallback(() => {
    const pieces = parseLabelPieces(editLabelInputValue);
    editNode({
      pieces,
      width: computeNodeWidth(pieces),
    });
  });

  const handleEditNodeTypeChange = useCallback((value) => {
    editNodeType(value);
  });

  const handleEditNodeValueChange = useCallback((value) => {
    editNodeValue(value);
  });

  // Handle stage reset button click, setting the editor state back to the initial state
  const handleResetState = () => {
    // TODO improve the stage reset function
    stageReset({
      nodes: sanitizeNodes(propNodes),
      selectedNode: propSelectedNode,
      edges: sanitizeEdges(propEdges),
      selectedEdge: propSelectedEdge,
      selectedRootNode: propSelectedRootNode,
      stagePos: propStagePos || { x: 0, y: 0 },
      stageScale: propStageScale || { x: 0, y: 0 },
      connectorPlaceholder: propConnectorPlaceholder || '{{}}',
    });
  };

  // TODO undo / redo
  const hasStateToUndo = false;
  const hasStateToRedo = false;
  const handleUndoButtonAction = useCallback(() => {});
  const handleRedoButtonAction = useCallback(() => {});

  const handleCreateNode = useCallback(() => {
    const pointerPos = stageRef.current.getPointerPosition();
    const labelPieces = parseLabelPieces(createNodeInputValue);
    const nodeWidth = computeNodeWidth(
      labelPieces,
    );
    const id = maxNodeId(nodes) + 1;
    createNode({
      id,
      pieces: labelPieces,
      x: (pointerPos.x - stagePos.x) / stageScale.x,
      y: (pointerPos.y - stagePos.y) / stageScale.y,
      width: nodeWidth,
      type: '',
      value: '',
      isFinal: false,
    });
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
    const orderedNodes = reorderNodes(
      nodes,
      edges,
      selectedRootNode,
    );

    const position = { x: 0, y: 0 };
    const scale = { x: 1, y: 1 };

    setOrderedNodes({
      nodes: orderedNodes,
      stagePos: position,
      stageScale: scale,
    });
  });

  const handleValidateTreeButtonAction = useCallback(() => {
    if (selectedRootNode !== undefined && selectedRootNode !== null) {
      const rootNode = nodeById(selectedRootNode, nodes);
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
      if (edge.attrs.id === selectedEdge) {
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
            (node) => node.attrs.id === errorType.nodeId,
          );
        currentNode.parent.moveToTop();
      } else if (errorType.edge) {
        const currentEdge = stageRef.current
          .find('.Edge')
          .toArray()
          .find(
            (edge) => edge.attrs.id === errorType.edgeId,
          );
        currentEdge.moveToTop();
      }
    }
  }, [validationErrors, currentError]);

  // Set the theme primary and secondary colors according to the received props
  const theme = useMemo(() => createMuiTheme({
    palette: {
      primary: { main: style.toolbar.primaryColor },
      secondary: { main: style.toolbar.secondaryColor },
    },
  }), [style]);

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
    isMetaOrShiftKeyPressed,
    isEscapedKeyPressed,
  } = useKeypress(containerRef, isFullDisabled);

  const handleConnectorDragStart = useCallback((isParent, nodeId, x, y, pieceId) => {
    if (!isMetaOrShiftKeyPressed) {
      if (!isParent) {
        const edge = edgeByChildNode(nodeId, edges)[0];
        if (edge) {
          const parentPieceX = computeLabelPiecesXCoordinatePositions(
            nodeById(edge.parentNodeId, nodes).pieces,
          )[edge.parentPieceId];
          const parentPos = computeEdgeParentPos(
            edge.parentNodeId,
            parentPieceX,
            nodes,
            style.fontSize,
            style.node.placeholder.width,
          );
          const newDragEdge = {
            originalEdgeId: edge.id,
            updateParent: false,
            parentNodeId: edge.parentNodeId,
            parentPieceId: edge.parentPieceId,
            parentX: parentPos.x,
            parentY: parentPos.y - fontSize / 2,
            childX: x,
            childY: y,
          };
          setDragEdge({ dragEdge: newDragEdge });
        } else {
          const newDragEdge = {
            originalEdgeId: null,
            updateParent: true,
            childNodeId: nodeId,
            childX: x,
            childY: y,
            parentX: x,
            parentY: y,
          };
          setDragEdge({ dragEdge: newDragEdge });
        }
      } else {
        const edge = edgeByParentPiece(nodeId, pieceId, edges)[0];
        if (edge) {
          const childPos = computeEdgeChildPos(edge.childNodeId, nodes);
          const newDragEdge = {
            originalEdgeId: edge.id,
            updateParent: true,
            childNodeId: edge.childNodeId,
            childX: childPos.x,
            childY: childPos.y,
            parentX: x,
            parentY: y,
          };
          setDragEdge({ dragEdge: newDragEdge });
        } else {
          const newDragEdge = {
            originalEdgeId: null,
            updateParent: false,
            parentNodeId: nodeId,
            parentPieceId: pieceId,
            parentX: x,
            parentY: y,
            childX: x,
            childY: y,
          };
          setDragEdge({ dragEdge: newDragEdge });
        }
      }
    }
  });

  const handleConnectorDragMove = useCallback(() => {
    const pointerPos = stageRef.current.getPointerPosition();
    if (dragEdge) {
      if (dragEdge.updateParent) {
        moveDragEdgeParentEndTo({
          x: (pointerPos.x - stagePos.x) / stageScale.x,
          y: (pointerPos.y - stagePos.y) / stageScale.y,
        });
      } else {
        moveDragEdgeChildEndTo({
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
      setAddEdgeErrorSnackbarMessage(error.message);
    };

    const fulfillUpdate = (edgeId, edge) => {
      updateEdge({
        edgeId,
        newEdge: edge,
      });
    };

    const fulfillNewEdge = (edge) => {
      addEdge({ edge });
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
        const oldEdge = edgeById(oldEdgeId, edges);

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
          .then(() => checkIsMultiEdgeOnHoleConnector(
            allowedErrors.multiEdgeOnHoleConnector,
            targetParentPiece,
            edges,
          ))
          .then(() => checkIsCreatingLoop(
            allowedErrors.loop,
            nodeById(oldEdge.childNodeId, nodes),
            [targetParentPiece.parentNodeId],
            edges,
            nodes,
            connectorPlaceholder,
          ))
          .then(() => fulfillUpdate(oldEdgeId, newEdge))
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
          .then(() => checkIsMultiEdgeOnHoleConnector(
            allowedErrors.multiEdgeOnHoleConnector,
            targetParentPiece,
            edges,
          ))
          .then(() => checkIsCreatingLoop(
            allowedErrors.loop,
            nodeById(newEdge.childNodeId, nodes),
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
        const oldEdge = edgeById(oldEdgeId, edges);

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
          .then(() => checkIsMultiEdgeOnNodeConnector(
            allowedErrors.multiEdgeOnNodeConnector,
            targetChildId,
            edges,
          ))
          .then(() => checkIsCreatingLoop(
            allowedErrors.loop,
            nodeById(targetChildId, nodes),
            [oldEdge.parentNodeId],
            edges,
            nodes,
            connectorPlaceholder,
          ))
          .then(() => fulfillUpdate(oldEdgeId, newEdge))
          .catch(rejectCallback);
      } else {
        // If it does not point to a valid target, do nothing
        if (targetChildId === null || targetChildId === undefined) {
          removeEdge(oldEdgeId);
          return;
        }

        const newEdge = {
          parentNodeId: dragEdge.parentNodeId,
          parentPieceId: dragEdge.parentPieceId,
          childNodeId: targetChildId,
        };

        checkSameNodeTarget(newEdge, targetChildId)
          .then(() => checkIsMultiEdgeOnNodeConnector(
            allowedErrors.multiEdgeOnHoleConnector,
            targetChildId,
            edges,
          ))
          .then(() => checkIsCreatingLoop(
            allowedErrors.loop,
            nodeById(targetChildId, nodes),
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

  const handleNodeDragStart = useCallback((e) => {
    if (isFullDisabled) {
      return;
    }

    if (!isMetaOrShiftKeyPressed) {
      transformerRef.current.nodes([]);
      e.currentTarget.moveToTop();
      setIsDraggingNode(true);
    } else {
      e.target.stopDrag();
    }
  });

  const handleNodeDragMove = useCallback((e, nodeId) => {
    e.cancelBubble = true;
    if (isFullDisabled) {
      return;
    }

    if (isDraggingNode) {
      const x = e.target.x();
      const y = e.target.y();
      moveNodeTo({ nodeId, x, y });
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
      moveNodeToEnd({
        nodeId,
        x,
        y,
      });
    }
  });

  useEffect(() => {
    if (isBackpasceOrDeleteKeyPressed) {
      if (selectedNode !== null && selectedNode !== undefined) {
        // TODO cannot remove with delete
        // if (!nodeById(selectedNode, nodes).isFinal) {
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

  useEffect(() => {
    if (isMetaOrShiftKeyPressed) {
      setCursor('grab');
    } else {
      setCursor('move');
    }
  }, [isMetaOrShiftKeyPressed]);

  const handleNodeClick = useCallback((e, nodeId) => {
    e.cancelBubble = true;
    if (isFullDisabled) {
      return;
    }

    if (!isMetaOrShiftKeyPressed) {
      transformerRef.current.nodes([]);
      if (isCreatingNode) {
        handleCreateNode();
      } else {
        e.currentTarget.moveToTop();
        const selectingNode = nodeById(nodeId, nodes);
        if (selectedNode !== selectingNode.id) {
          setSelectedNode(selectingNode.id);
        }
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

    if (isDraggingSelectionRect && isMetaOrShiftKeyPressed) {
      setCursor('move');
      setIsSelectingRectVisible(false);
      setIsDraggingSelectionRect(false);
      const allNodes = stageRef.current.find('.Node').toArray();
      const box = selectionRectRef.current.getClientRect();
      const intersectingNodes = allNodes.filter((node) => Konva.Util.haveIntersection(box, node.getClientRect()));
      intersectingNodes.map((intersectingNode) => intersectingNode.parent.moveToTop());
      selectedRectRef.current.moveToTop();
      transformerRef.current.nodes(intersectingNodes);
      setIsSelectedRectVisible(true);
      selectedRectRef.current.moveToTop();
    } else {
      const newStagePos = stageRef.current.absolutePosition();
      setStagePos(newStagePos);
    }
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

    if (isMetaOrShiftKeyPressed) {
      e.cancelBubble = true;
      const pointerPos = stageRef.current.getPointerPosition();
      setSelectionRectStartPos({
        x: (pointerPos.x - stagePos.x) / stageScale.x,
        y: (pointerPos.y - stagePos.y) / stageScale.y,
      });
      setSelectionRectEndPos({
        x: (pointerPos.x - stagePos.x) / stageScale.x,
        y: (pointerPos.y - stagePos.y) / stageScale.y,
      });
      setIsSelectingRectVisible(true);
      setIsSelectedRectVisible(false);
      setIsDraggingSelectionRect(true);
      selectionRectRef.current.moveToTop();
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

  // Handle drag move event on multiple nodes selection,
  // updating the selected nodes positions
  const handleSelectedDragMove = (e) => {
    e.cancelBubble = true;
    moveSelectedNodesTo({
      nodes: transformerRef.current.nodes(),
      delta: { x: e.evt.movementX, y: e.evt.movementY },
    });
  };

  // Handle drag end event on multiple nodes selection,
  // updating the selected nodes to the final positions
  // (different action to be able to filter all the previous
  // moving actions to allow undo/redo working)
  const handleSelectedDragEnd = (e) => {
    e.cancelBubble = true;
    setCursor('grab');
    moveSelectedNodesToEnd({
      nodes: transformerRef.current.nodes(),
      delta: { x: e.evt.movementX, y: e.evt.movementY },
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        ref={containerRef}
        role="tab"
        style={{
          position: 'relative',
          width: width || '100%',
          border: style.container.border,
          borderRadius: style.container.borderRadius,
          backgroundColor: style.container.backgroundColor,
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
          editLabelInputValue={editLabelInputValue}
          editTypeInputValue={editTypeInputValue}
          editValueInputValue={editValueInputValue}
          showToolbar={showToolbar}
          showToolbarButtons={showToolbarButtons}
          showDrawer={showDrawer}
          showDrawerSections={showDrawerSections}
          templateNodes={templateNodes}
          allowFreeTypeEdit={allowFreeTypeEdit}
          allowFreeValueEdit={allowFreeValueEdit}
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
          setEditLabelInputValue={setEditLabelInputValue}
          setEditTypeInputValue={setEditTypeInputValue}
          setEditValueInputValue={setEditValueInputValue}
          handleResetState={handleResetState}
          handleEditLabelPiecesChange={handleEditLabelPiecesChange}
          handleEditNodeTypeChange={handleEditNodeTypeChange}
          handleEditNodeValueChange={handleEditNodeValueChange}
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
            draggable={!isMetaOrShiftKeyPressed && !isFullDisabled}
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
              {edges.map((edge) => (
                <Edge
                  key={`Edge-${edge.id}`}
                  id={edge.id}
                  nodes={nodes}
                  childNodeId={edge.childNodeId}
                  parentNodeId={edge.parentNodeId}
                  parentPieceId={edge.parentPieceId}
                  isDragged={dragEdge && dragEdge.originalEdgeId === edge.id}
                  isFullDisabled={isFullDisabled}
                  isDraggingSelectionRect={isDraggingSelectionRect}
                  isSelected={edge.id === selectedEdge}
                  clearEdgeSelection={clearSelectedEdge}
                  nodePaddingX={style.node.paddingX}
                  nodePaddingY={style.node.paddingY}
                  // Event Listeners
                  handleEdgeClick={handleEdgeClick}
                  handleConnectorDragStart={handleConnectorDragStart}
                  handleConnectorDragMove={handleConnectorDragMove}
                  handleConnectorDragEnd={handleConnectorDragEnd}
                  computeLabelPiecesXCoordinatePositions={computeLabelPiecesXCoordinatePositions}
                  setCursor={setCursor}
                  // Style
                  placeholderWidth={style.node.placeholder.width}
                  fontSize={fontSize}
                  style={style.edge}
                />
              ))}
              {/* Map all the state nodes */}
              { nodes.map((node) => (
                <Node
                  key={`Node-${node.id}`}
                  id={node.id}
                  labelPieces={node.pieces}
                  positionX={nodePositionById(node.id, nodes).x}
                  positionY={nodePositionById(node.id, nodes).y}
                  typeText={node.type}
                  valueText={node.value}
                  connectorPlaceholder={connectorPlaceholder}
                  placeholderWidth={placeholderWidth}
                  stageRef={stageRef}
                  stageWidth={containerWidth}
                  stageHeight={height}
                  transformerRef={transformerRef}
                  nodeWidth={node.width}
                  edges={edges}
                  moveNodeTo={moveNodeTo}
                  moveNodeToEnd={moveNodeToEnd}
                  removeNode={removeNode}
                  computeLabelPiecesXCoordinatePositions={computeLabelPiecesXCoordinatePositions}
                  setCursor={setCursor}
                  isDraggingSelectionRect={isDraggingSelectionRect}
                  isFinal={node.isFinal}
                  isSelected={node.id === selectedNode}
                  isSelectedRoot={node.id === selectedRootNode}
                  isMetaOrShiftKeyPressed={isMetaOrShiftKeyPressed}
                  isFullDisabled={isFullDisabled}
                  handleNodeClick={(e) => handleNodeClick(e, node.id)}
                  handleNodeDblClick={() => handleNodeDblClick(node.id)}
                  handleNodeDragStart={(e) => handleNodeDragStart(e, node.id)}
                  handleNodeDragMove={(e) => handleNodeDragMove(e, node.id)}
                  handleNodeDragEnd={(e) => handleNodeDragEnd(e, node.id)}
                  handleConnectorDragStart={handleConnectorDragStart}
                  handleConnectorDragMove={handleConnectorDragMove}
                  handleConnectorDragEnd={handleConnectorDragEnd}
                  fontSize={style.fontSize}
                  fontFamily={style.fontFamily}
                  nodeStyle={style.node}
                  connectorStyle={style.edge.connector}
                />
              ))}
              {/* Multiple selection rectangle component */}
              <Rect
                ref={selectionRectRef}
                x={Math.min(selectionRectStartPos.x, selectionRectEndPos.x)}
                y={Math.min(selectionRectStartPos.y, selectionRectEndPos.y)}
                width={Math.abs(selectionRectEndPos.x - selectionRectStartPos.x)}
                height={Math.abs(selectionRectEndPos.y - selectionRectStartPos.y)}
                fill={style.selectionRectColor}
                visible={isSelectingRectVisible}
              />
              {/* Multiple selected rectangle component */}
              <Rect
                ref={selectedRectRef}
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
                width={
                  transformerRef.current
                  && transformerRef.current.getClientRect().width
                    / stageRef.current.scale().x
                }
                height={
                  transformerRef.current
                  && transformerRef.current.getClientRect().height
                    / stageRef.current.scale().y
                }
                fill="rgba(255, 255, 255, 0)"
                visible={isSelectedRectVisible}
                draggable={!isFullDisabled}
                // onMouseEnter={() => {
                //   setCursor('grab');
                // }}
                // onDragStart={() => {
                //   setCursor('grabbing');
                // }}
                onDragMove={handleSelectedDragMove}
                onDragEnd={handleSelectedDragEnd}
                onMouseDown={handleStageMouseDown}
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
                  style={style.dragEdge}
                />
              )}
            </Layer>
          </Stage>
        </div>
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
  allowFreeTypeEdit: PropTypes.bool,
  allowFreeValueEdit: PropTypes.bool,
  templateNodeTypesAndValues: PropTypes.shape({}),
  nodes: PropTypes.arrayOf(PropTypes.shape({
    pieces: PropTypes.arrayOf(PropTypes.string),
    x: PropTypes.number,
    y: PropTypes.number,
    type: PropTypes.string,
    value: PropTypes.string,
    isFinal: PropTypes.bool,
  })),
  selectedNode: PropTypes.number,
  edges: PropTypes.arrayOf(PropTypes.shape({

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
  connectorPlaceholder: PropTypes.string,
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
  style: PropTypes.exact({
    fontSize: PropTypes.number,
    fontFamily: PropTypes.string,
    selectionRectColor: PropTypes.string,
    node: PropTypes.exact({
      paddingX: PropTypes.number,
      paddingY: PropTypes.number,
      radius: PropTypes.number,
      strokeColor: PropTypes.string,
      strokeWidth: PropTypes.number,
      strokeSelectedWidth: PropTypes.number,
      fillColor: PropTypes.string,
      errorColor: PropTypes.string,
      selectedColor: PropTypes.string,
      finalColor: PropTypes.string,
      textColor: PropTypes.string,
      deleteButtonColor: PropTypes.string,
      placeholder: PropTypes.exact({
        width: PropTypes.number,
        strokeSize: PropTypes.number,
        strokeColor: PropTypes.string,
        fillColor: PropTypes.string,
        radius: PropTypes.number,
      }),
      star: PropTypes.exact({
        strokeSize: PropTypes.number,
        strokeColor: PropTypes.string,
        numPoints: PropTypes.number,
        innerRadius: PropTypes.number,
        outerRadius: PropTypes.number,
      }),
      delete: PropTypes.exact({
        paddingX: PropTypes.number,
        paddingY: PropTypes.number,
        fontSize: PropTypes.number,
        text: PropTypes.string,
        textColor: PropTypes.string,
        overTextColor: PropTypes.string,
      }),
      typeValue: PropTypes.exact({
        fontSize: PropTypes.number,
        fillColor: PropTypes.string,
        strokeSize: PropTypes.string,
        strokeColor: PropTypes.string,
        pointerDirection: PropTypes.string,
        pointerWidth: PropTypes.number,
        pointerHeight: PropTypes.number,
        radius: PropTypes.number,
        textColor: PropTypes.string,
        padding: PropTypes.number,
      }),
    }),
    edge: PropTypes.exact({
      size: PropTypes.number,
      color: PropTypes.string,
      errorColor: PropTypes.string,
      selectedColor: PropTypes.string,
      draggingColor: PropTypes.string,
      connector: PropTypes.exact({
        child: PropTypes.exact({
          radiusSize: PropTypes.number,
          color: PropTypes.string,
          emptyColor: PropTypes.string,
          draggingColor: PropTypes.string,
          errorColor: PropTypes.string,
          strokeSize: PropTypes.number,
          strokeColor: PropTypes.string,
        }),
        parent: PropTypes.exact({
          radiusSize: PropTypes.number,
          color: PropTypes.string,
          draggingColor: PropTypes.string,
          errorColor: PropTypes.string,
          strokeSize: PropTypes.number,
          strokeColor: PropTypes.string,
        }),
      }),
    }),
    dragEdge: PropTypes.exact({
      strokeSize: PropTypes.number,
      color: PropTypes.string,
      connector: PropTypes.exact({
        child: PropTypes.exact({
          radiusSize: PropTypes.number,
          color: PropTypes.string,
          strokeSize: PropTypes.number,
          strokeColor: PropTypes.string,
        }),
        parent: PropTypes.exact({
          radiusSize: PropTypes.number,
          color: PropTypes.string,
          strokeSize: PropTypes.number,
          strokeColor: PropTypes.string,
        }),
      }),
    }),
    toolbar: PropTypes.exact({
      primaryColor: PropTypes.string,
      secondaryColor: PropTypes.string,
    }),
    container: PropTypes.exact({
      border: PropTypes.string,
      borderRadius: PropTypes.string,
      backgroundColor: PropTypes.string,
    }),
  }),
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
  allowFreeTypeEdit: true,
  allowFreeValueEdit: true,
  templateNodeTypesAndValues: undefined,
  connectorPlaceholder: undefined,
  nodes: [],
  selectedNode: undefined,
  edges: [],
  selectedEdge: undefined,
  selectedRootNode: undefined,
  stagePos: undefined,
  stageScale: undefined,
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
  style: defaultStyle,
};

export default ExpressionTreeEditor;
