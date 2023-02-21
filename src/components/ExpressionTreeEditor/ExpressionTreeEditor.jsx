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

import { createTheme, ThemeProvider } from '@material-ui/core/styles';
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

import {
  layout,
} from '../../utils/layout';

import useStore from '../../hooks/useStore';
import useKeypress from '../../hooks/useKeypress';
import useContainerWidthOnWindowResize from '../../hooks/useContainerWidthOnWindowResize';

import { defaultProps } from '../../store/initialState';

import FontFaceObserver from 'fontfaceobserver';
import '@fontsource/roboto-mono/300.css';

// Key used to store and retrieve metadata in PNG files.
const ET_KEY = 'expressiontutor';

function ExpressionTreeEditor({
  reference,
  width,
  height,
  autolayout,
  shuffleNodes,
  allowedErrors,
  isFullDisabled,
  showToolbar,
  showToolbarButtons,
  showDrawer,
  showDrawerSections,
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
  drawerPlaceholders,
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
    shuffleNodes,
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
    setNodeEditability,

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
    setStartingOrderedNodes,
    setOrderedNodes,
    // Undo - Redo
    undo,
    redo,
    // Utility
    resetEdges,
    resetTypeLabels,
    resetValueLabels,
    resetRootNode,
    updateGlobalState,
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
    createNodeFromPieces,
  } = utils;

  useEffect(() => {
    if (reference) {
      reference.current = {
        resetEdges,
        resetTypeLabels,
        resetValueLabels,
        resetRootNode,
        updateGlobalState,
        getGlobalState: useCallback(() => exportState(store) , [exportState, store]),
      };
    }
  }, []);

  const computeStageWidth = () => width || containerWidth;

  const [robotoFontAvailable, setRobotoFontAvailable] = useState(false);
  const fontFaceObserver = new FontFaceObserver('Roboto Mono');
  useEffect(() => {
    fontFaceObserver.load().then(() => {
      setRobotoFontAvailable(true);
    });
  }, [robotoFontAvailable]);

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

  const hasStateToUndo = undoState.length > 0;
  const hasStateToRedo = redoState.length > 0;
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

  // --- Zoom actions

  const handleZoomOutButtonAction = useCallback(() => {
    const zoomFactor = 1.1;
    //zoomStage(1 / zoomFactor); TODO: remove zoomStage function
    const { current } = stageRef;
    const oldScale = current.scaleX();
    const oldX = current.x();
    const oldY = current.y();
    const w = current.width();
    const h = current.height();
    const newScale = oldScale / zoomFactor;
    const newX = (oldX - w / 2) / zoomFactor + w / 2;
    const newY = (oldY - h / 2) / zoomFactor + h / 2;
    setStagePositionAndScale({
      stageScale: { x: newScale, y: newScale },
      stagePos: { x: newX, y: newY },
    });
  });

  const handleZoomInButtonAction = useCallback(() => {
    const zoomFactor = 1.1;
    //zoomStage(zoomFactor); TODO: remove zoomStage function
    const { current } = stageRef;
    const oldScale = current.scaleX();
    const oldX = current.x();
    const oldY = current.y();
    const w = current.width();
    const h = current.height();
    const newScale = oldScale * zoomFactor;
    const newX = (oldX - w / 2) * zoomFactor + w / 2;
    const newY = (oldY - h / 2) * zoomFactor + h / 2;
    setStagePositionAndScale({
      stageScale: { x: newScale, y: newScale },
      stagePos: { x: newX, y: newY },
    });
  });

  const handleStageWheel = (e) => {
    const zoomFactor = 1.05;
    e.evt.preventDefault();
    if (isFullDisabled) {
      return; //TODO: What's the connection between mouse wheel zoom and full screen?
    }
    // don't zoom if small Y change
    if (Math.abs(e.evt.deltaY) < 5) return;
    const { current } = stageRef;
    const zoomMultiplier = e.evt.deltaY < 0 ? zoomFactor : (1 / zoomFactor);
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
    // zoomStageWheel(...); // TODO remove zoomStageWheel function
    setStagePositionAndScale({
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
    const paddingLeft = isDrawerOpen && showDrawer ? 330 : 30;
    const paddingRight = 30;
    const paddingTop = 30;
    const paddingBottom = 30;
    // get the bounding box of layer contents
    const box = layerRef.current.getClientRect({
      relativeTo: stageRef.current,
    });
    const scale = Math.min(
      (stageRef.current.width() - paddingLeft - paddingRight) / box.width,
      (stageRef.current.height() - paddingTop - paddingBottom) / box.height,
    );
    const x = paddingLeft - box.x * scale;
    const y = paddingTop - box.y * scale;
    setStagePositionAndScale({
      stageScale: { x: scale, y: scale },
      stagePos: { x, y },
    });
  };

  const handleZoomToActualSizeButtonAction = () => {
    const paddingLeft = isDrawerOpen && showDrawer ? 330 : 30;
    const paddingTop = 30;
    // get the bounding box of layer contents
    const box = layerRef.current.getClientRect({
      relativeTo: stageRef.current,
    });
    const scale = 1;
    const x = paddingLeft - box.x;
    const y = paddingTop - box.y;
    setStagePositionAndScale({
      stageScale: { x: scale, y: scale },
      stagePos: { x, y },
    });
  };

  const handleReorderNodesButtonAction = useCallback((initialValue, noHistory) => {
    const tempNodes = initialValue && initialValue.nodes ? initialValue.nodes : nodes;
    const tempEdges = initialValue && initialValue.edges ? initialValue.edges : edges;

    //TODO: Determine whether need to clone nodes before calling layout
    /*
    // Call old layout (reorder) code
    const orderedNodes = reorderNodes(
      nodes,
      edges,
      selectedRootNode,
    );
    */
    // Structured clone is a deep clone
    // https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
    // eslint-disable-next-line no-undef
    const orderedNodes = structuredClone(tempNodes);
    // const orderedNodes = tempNodes;
    const [diagramWidth, diagramHeight] = layout(
      orderedNodes,
      tempEdges,
      selectedRootNode,
      isDrawerOpen && showDrawer,
      computeStageWidth(),
    );
    //console.log('node layout: diagram width: ', diagramWidth, 'diagram height: ', diagramHeight);

    const orderedEdges = computeEdgesCoordinates(tempEdges, orderedNodes);
    const position = { x: 0, y: 0 };
    const scale = { x: 1, y: 1 };

    if (noHistory) {
      setStartingOrderedNodes({
        nodes: orderedNodes,
        edges: orderedEdges,
        stagePos: position,
        stageScale: scale,
      });
    } else {
      setOrderedNodes({
        nodes: orderedNodes,
        edges: orderedEdges,
        stagePos: position,
        stageScale: scale,
      });
    }
  }, [
    nodes,
    edges,
    isDrawerOpen,
    showDrawer,
    computeEdgesCoordinates,
    setStartingOrderedNodes,
    setOrderedNodes,
    computeStageWidth,
  ]);

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
    stageRef.current.find('.deleteButton').forEach((shape) => shape.visible(inverse));
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

  const handleSelectedNodeEditableLabelChange = useCallback(({ target }) => {
    const { checked } = target;
    if (selectedNode) {
      setNodeEditability({
        nodeId: selectedNode,
        allowLabel: checked,
        allowValue: nodes[selectedNode].editable.value,
        allowType: nodes[selectedNode].editable.type,
        allowDelete: nodes[selectedNode].editable.delete,
      });
    }
  });

  const handleSelectedNodeEditableDeleteChange = useCallback(({ target }) => {
    const { checked } = target;
    if (selectedNode) {
      setNodeEditability({
        nodeId: selectedNode,
        allowLabel: nodes[selectedNode].editable.label,
        allowValue: nodes[selectedNode].editable.value,
        allowType: nodes[selectedNode].editable.type,
        allowDelete: checked,
      });
    }
  });

  const handleSelectedNodeEditableTypeChange = useCallback(({ target }) => {
    const { checked } = target;
    if (selectedNode) {
      setNodeEditability({
        nodeId: selectedNode,
        allowLabel: nodes[selectedNode].editable.label,
        allowValue: nodes[selectedNode].editable.value,
        allowType: checked,
        allowDelete: nodes[selectedNode].editable.delete,
      });
    }
  });

  const handleSelectedNodeEditableValueChange = useCallback(({ target }) => {
    const { checked } = target;
    if (selectedNode) {
      setNodeEditability({
        nodeId: selectedNode,
        allowLabel: nodes[selectedNode].editable.label,
        allowValue: checked,
        allowType: nodes[selectedNode].editable.type,
        allowDelete: nodes[selectedNode].editable.delete,
      });
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

  const handleResetState = () => {
    const { sanitizedNodes, sanitizedEdges } = sanitizeNodesAndEdges(propNodes, propEdges, shuffleNodes);
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

    if (autolayout) {
      handleReorderNodesButtonAction({ nodes: sanitizedNodes, edges: sanitizedEdges });
    }
  };

  useEffect(() => {
    if (autolayout) {
      const { sanitizedNodes, sanitizedEdges } = sanitizeNodesAndEdges(propNodes, propEdges, shuffleNodes);
      handleReorderNodesButtonAction({ nodes: sanitizedNodes, edges: sanitizedEdges }, true);
    }
  }, [propNodes, propEdges, shuffleNodes]);

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
          // console.log(n);
        });
        if (node) {
          const imageBase64 = node.toCanvas({
            pixelRatio: 2,
          }).toDataURL();

          // console.log(imageBase64);
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
    stageRef.current.find('.Edge').forEach((edge) => {
      if (edge.attrs && edge.attrs.id === selectedEdge) {
        edge.moveToTop();
      } else {
        edge.moveToBottom();
      }
    });
  }, [selectedEdge]);

  // Set the theme primary and secondary colors according to the received props
  const theme = useMemo(() => createTheme({
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
        // if (nodes[selectedNode].editable.delete) {
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

  const handleNodeDblClick = useCallback((e, nodeId) => {
    if (isFullDisabled) {
      return;
    }

    if (nodeId === selectedRootNode) {
      clearSelectedRootNode();
    } else {
      setSelectedRootNode(nodeId);
    }

    e.cancelBubble = true;
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

  // Handle stage click event, if the adding node button has been pressed,
  // add the new node at the clicked location, otherwise clear all selections
  const handleStageClick = (e) => {
    if (isFullDisabled) {
      return;
    }

    // If the event is propagated from another target, return
    if (e.target !== stageRef.current) {
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
          currentError={currentError}
          addEdgeErrorMessage={addEdgeErrorMessage}
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
          handleZoomToActualSizeButtonAction={handleZoomToActualSizeButtonAction}
          handleReorderNodesButtonAction={handleReorderNodesButtonAction}
          handleUploadStateButtonAction={handleUploadStateButtonAction}
          handleTakeScreenshotButtonAction={handleTakeScreenshotButtonAction}
          handleFullScreenButtonAction={handleFullScreenButtonAction}
          handleSelectedNodeEditableLabelChange={handleSelectedNodeEditableLabelChange}
          handleSelectedNodeEditableDeleteChange={handleSelectedNodeEditableDeleteChange}
          handleSelectedNodeEditableTypeChange={handleSelectedNodeEditableTypeChange}
          handleSelectedNodeEditableValueChange={handleSelectedNodeEditableValueChange}
          createNodeDescription={createNodeDescription}
          nodeFontSize={fontSize}
          nodeFontFamily={fontFamily}
          nodePaddingX={nodePaddingX}
          nodePaddingY={nodePaddingY}
          nodeStyle={nodeStyle}
          drawerPlaceholders={drawerPlaceholders}
        />
        <div>
          {/* Stage component containing the layer component */}
          <Stage
            ref={stageRef}
            width={computeStageWidth()}
            height={height}
            style={{ cursor: isCreatingNode && 'crosshair' }}
            onClick={handleStageClick}
            onTap={handleStageClick}
            draggable={!isFullDisabled}
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
                const newStagePos = stageRef.current.absolutePosition();
                setStagePos(newStagePos);
                setCursor('move');
              })
            }
            onWheel={handleStageWheel}
          >
            <Layer ref={layerRef}>
              {/* Uncomment for zoom debugging:
              <Rect
                x={0}
                y={0}
                width={200}
                height={100}
                fill="#f0f0f0"
                stroke="black"
              />
              <Circle
                x={0}
                y={0}
                radius={20}
                fill="red"
                stroke="black"
                strokeWidth={1}
              />
              <Circle
                x={902}
                y={700}
                radius={10}
                fill="blue"
                stroke="black"
                strokeWidth={1}
              />
              */}
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
                  editableLabel={nodes[id].editable.label}
                  editableType={nodes[id].editable.type}
                  editableValue={nodes[id].editable.value}
                  editableDelete={nodes[id].editable.delete}
                  isSelected={id === selectedNode}
                  isSelectedRoot={id === selectedRootNode}
                  isHighlighted={nodes[id].isHighlighted}
                  isTypeLabelHighlighted={nodes[id].isTypeLabelHighlighted}
                  isValueLabelHighlighted={nodes[id].isValueLabelHighlighted}
                  isFullDisabled={isFullDisabled}
                  handleNodeClick={(e) => handleNodeClick(e, id)}
                  handleNodeDblClick={(e) => handleNodeDblClick(e, id)}
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
  reference: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any,
    }),
  ]),
  width: PropTypes.number,
  height: PropTypes.number,
  autolayout: PropTypes.bool,
  shuffleNodes: PropTypes.bool,
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
    showZoomToAcualSizeButton: PropTypes.bool,
    showReorderNodesButton: PropTypes.bool,
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
    editFinalNodeField: PropTypes.bool,
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
    editable: PropTypes.shape({
      label: PropTypes.bool,
      type: PropTypes.bool,
      value: PropTypes.bool,
      delete: PropTypes.bool,
    }),
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
  onStateChange: PropTypes.func,

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
  /**
   * Style object for the dragEdge element
   */
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
      textTypeColor: PropTypes.string,
      textValueColor: PropTypes.string,
      fillTypeColor: PropTypes.string,
      fillValueColor: PropTypes.string,
      fillTypeHighlightColor: PropTypes.string,
      fillValueHighlightColor: PropTypes.string,
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
  drawerPlaceholders: PropTypes.shape({
    createNodeInputPlaceholder: PropTypes.string,
    editNodeInputPlaceholder: PropTypes.string,
    typeInputPlaceholder: PropTypes.string,
    valueInputPlaceholder: PropTypes.string,
  }),
};

ExpressionTreeEditor.defaultProps = {
  reference: null,
  width: null,
  height: 300,
  autolayout: false,
  shuffleNodes: false,
  allowedErrors: {
    loop: true,
    multiEdgeOnHoleConnector: true,
    multiEdgeOnNodeConnector: true,
  },
  isFullDisabled: false,
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
    showZoomToActualSizeButton: true,
    showReorderNodesButton: true,
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
    editFinalNodeField: false,
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
  drawerPlaceholders: {},
};

export default ExpressionTreeEditor;
