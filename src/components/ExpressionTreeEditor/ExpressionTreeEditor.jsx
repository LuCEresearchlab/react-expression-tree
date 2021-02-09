import Konva from 'konva';
import {
  Stage, Layer, Rect, Transformer,
} from 'react-konva';

import React, {
  useCallback,
  useEffect,
  useRef,
  useReducer,
  useState,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

// import { useDispatch } from 'react-redux';
// import { ActionCreators } from 'redux-undo';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Node from '../Node/Node';
import Edge from '../Edge/Edge';
import DragEdge from '../Edge/DragEdge';
import StageDrawer from '../StageDrawer/StageDrawer';

import reducer from '../store/reducers';
import reducerInitialState from '../store/initialState';

import {
  edgeByChildNode,
  computeLabelPiecesPositions,
  computeEdgeParentPos,
  edgeByParentPiece,
  computeEdgeChildPos,
  closestParentPiece,
  edgeById,
  closestChildId,
  nodeById,
  nodePositionById,
  computeNodeWidth,
} from '../utils';

import useContainerWidthOnWindowResize from './useContainerWidthOnWindowResize';

import '@fontsource/roboto-mono/300.css';

function ExpressionTreeEditor({
  width,
  height,
  toolbarButtons,
  drawerFields,
  fullDisabled,
  allowedErrors,
  reportedErrors,
  connectorPlaceholder,
  templateNodes,
  nodeTypes,
  initialState,
  // Event Listeners
  onNodeAdd,
  onNodeDelete,
  onNodeSelect,
  onNodeMove,
  onNodePiecesChange,
  onNodeTypeChange,
  onNodeValueChange,
  onEdgeAdd,
  onEdgeDelete,
  onEdgeUpdate,
  onEdgeSelect,
  onValidate,
  // Style
  style,
}) {
  // Refs
  const containerRef = useRef();
  const stageRef = useRef();
  const layerRef = useRef();
  const selectionRectRef = useRef();
  const selectedRectRef = useRef();
  const transformerRef = useRef();

  const [store, dispatch] = useReducer(reducer, reducerInitialState);
  const {
    nodes,
    edges,
    dragEdge,
    selectedNode,
    addingNode,
    selectedRootNode,
    selectedEdge,
    addValue,
    editValue,
    typeValue,
    nodeValue,
  } = store;

  const removeNode = useCallback((payload) => {
    dispatch({ type: 'removeNode', payload });
  }, [dispatch]);

  const moveNodeTo = useCallback((payload) => {
    dispatch({ type: 'moveNodeTo', payload });
  }, [dispatch]);

  const moveNodeToEnd = useCallback((payload) => {
    dispatch({ type: 'moveNodeToEnd', payload });
  }, [dispatch]);

  const setDragEdge = useCallback((payload) => {
    dispatch({ type: 'setDragEdge', payload });
  }, [dispatch]);

  const moveDragEdgeParentEndTo = useCallback((payload) => {
    dispatch({ type: 'moveDragEdgeParentEndTo', payload });
  }, [dispatch]);

  const moveDragEdgeChildEndTo = useCallback((payload) => {
    dispatch({ type: 'moveDragEdgeChildEndTo', payload });
  }, [dispatch]);

  const removeEdge = useCallback((payload) => {
    dispatch({ type: 'removeEdge', payload });
  }, [dispatch]);

  const addEdge = useCallback((payload) => {
    dispatch({ type: 'addEdge', payload });
  }, [dispatch]);

  const updateEdge = useCallback((payload) => {
    dispatch({ type: 'updateEdge', payload });
  }, [dispatch]);

  const clearDragEdge = useCallback(() => {
    dispatch({ type: 'clearDragEdge' });
  }, [dispatch]);

  const clearNodeSelection = useCallback(() => {
    dispatch({ type: 'clearNodeSelection' });
  }, [dispatch]);

  const addNode = useCallback((payload) => {
    dispatch({ type: 'addNode', payload });
  }, [dispatch]);

  const selectNode = useCallback((payload) => {
    dispatch({ type: 'selectNode', payload });
  }, [dispatch]);

  const clearAdding = useCallback(() => {
    dispatch({ type: 'clearAdding' });
  }, [dispatch]);

  const editValueChange = useCallback((payload) => {
    dispatch({ type: 'editValueChange', payload });
  }, [dispatch]);

  const typeValueChange = useCallback((payload) => {
    dispatch({ type: 'typeValueChange', payload });
  }, [dispatch]);

  const nodeValueChange = useCallback((payload) => {
    dispatch({ type: 'nodeValueChange', payload });
  }, [dispatch]);

  const selectEdge = useCallback((payload) => {
    dispatch({ type: 'selectEdge', payload });
  }, [dispatch]);

  const clearEdgeSelection = useCallback(() => {
    dispatch({ type: 'clearEdgeSelection' });
  }, [dispatch]);

  const selectRootNode = useCallback((payload) => {
    dispatch({ type: 'selectRootNode', payload });
  }, [dispatch]);

  const clearRootSelection = useCallback(() => {
    dispatch({ type: 'clearRootSelection' });
  }, [dispatch]);

  const setInitialState = useCallback((payload) => {
    dispatch({ type: 'setInitialState', payload });
  }, [dispatch]);

  const moveSelectedNodesTo = useCallback((payload) => {
    dispatch({ type: 'moveSelectedNodesTo', payload });
  }, [dispatch]);

  const moveSelectedNodesToEnd = useCallback((payload) => {
    dispatch({ type: 'moveSelectedNodesToEnd', payload });
  }, [dispatch]);

  // Drawer
  const editNode = useCallback((payload) => {
    dispatch({ type: 'editNode', payload });
  }, [dispatch]);

  const addingNodeClick = useCallback(() => {
    dispatch({ type: 'addingNodeClick' });
  }, [dispatch]);

  const addValueChange = useCallback((payload) => {
    dispatch({ type: 'addValueChange', payload });
  }, [dispatch]);

  const nodeTypeEdit = useCallback((payload) => {
    dispatch({ type: 'nodeTypeEdit', payload });
  }, [dispatch]);

  const nodeValueEdit = useCallback((payload) => {
    dispatch({ type: 'nodeValueEdit', payload });
  }, [dispatch]);

  const stageReset = useCallback((payload) => {
    dispatch({ type: 'stageReset', payload });
  }, [dispatch]);

  const uploadState = useCallback((payload) => {
    dispatch({ type: 'uploadState', payload });
  }, [dispatch]);

  const reorderNodes = useCallback((payload) => {
    dispatch({ type: 'reorderNodes', payload });
  }, [dispatch]);

  // Set the theme primary and secondary colors according to the recived props
  const theme = useMemo(() => createMuiTheme({
    palette: {
      primary: { main: style.toolbar.primaryColor },
      secondary: { main: style.toolbar.secondaryColor },
    },
  }), [style]);

  // Layout utils
  const oText = new Konva.Text({
    text: 'o',
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
  });
  const textHeight = oText.fontSize();
  const holeWidth = oText.getTextWidth();

  // State hooks
  const containerWidth = useContainerWidthOnWindowResize(containerRef);
  const [selectedEdgeRef, setSelectedEdgeRef] = useState(null);
  const [isPressingMetaOrShift, setIsPressingMetaOrShift] = useState(false);
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
  const [currentErrorLocation, setCurrentErrorLocation] = useState({});

  // Effects
  // Initial state setting effect running only on first render
  useEffect(() => {
    setInitialState({
      initialNodes: initialState.initialNodes,
      initialEdges: initialState.initialEdges,
      connectorPlaceholder,
      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
    });
    // dispatch(ActionCreators.clearHistory());
  }, []);

  const setCursor = useCallback((cursor) => {
    containerRef.current.style.cursor = cursor;
  }, []);

  const handleKeyDown = (e) => {
    if (e.currentTarget === e.target) {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (selectedNode && !selectedNode.isFinal) {
          clearNodeSelection();
          removeNode({ nodeId: selectedNode.id, onNodeDelete });
        } else if (selectedEdge) {
          setSelectedEdgeRef(null);
          clearEdgeSelection();
          removeEdge({ edgeId: selectedEdge.id, onEdgeDelete });
        }
      } else if (e.key === 'Escape') {
        if (addingNode) {
          clearAdding();
        } else if (selectedNode) {
          clearNodeSelection();
        } else if (selectedEdge) {
          selectedEdgeRef.moveToBottom();
          setSelectedEdgeRef(null);
          clearEdgeSelection();
        }
      } else if (e.key === 'Meta' || e.key === 'Shift') {
        setCursor('grab');
        setIsPressingMetaOrShift(true);
      }
    }
  };

  const handleKeyUp = (e) => {
    if (e.currentTarget === e.target) {
      if (e.key === 'Meta' || e.key === 'Shift') {
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
        setIsPressingMetaOrShift(false);
      }
    }
  };

  // TODO Can this be removed?
  // const onFocus = () => {
  //   setCursor('move');
  //   setIsSelectingRectVisible(false);
  //   setIsDraggingSelectionRect(false);
  //   setIsPressingMetaOrShift(false);
  // };

  // Check if the edge that is going to be added/updated is going to create a loop
  // in the tree, by checking if we get to an already visited node on the walking branch
  // while performing an in order tree walk
  function checkIsCreatingLoop(node, visitedBranch, creatingLoop) {
    visitedBranch.push(node.id);
    node.pieces.forEach((piece, i) => {
      if (piece === connectorPlaceholder) {
        const childEdges = edgeByParentPiece(node.id, i, edges);
        childEdges.forEach((edge) => {
          const childNode = nodeById(edge.childNodeId, nodes);
          if (visitedBranch.find((e) => e === childNode.id) !== undefined) {
            creatingLoop = true;
            return [visitedBranch, creatingLoop];
          }
          [visitedBranch, creatingLoop] = checkIsCreatingLoop(
            childNode,
            visitedBranch,
            creatingLoop,
          );
        });
      }
    });
    visitedBranch.pop();
    return [visitedBranch, creatingLoop];
  }

  // Handle drag start event from a node connector by setting up the corresponding DragEdge
  const handleNodeConnectorDragStart = (nodeId, x, y) => {
    if (addingNode) {
      clearAdding();
    }
    const edge = edgeByChildNode(nodeId, edges)[0];
    if (edge) {
      const parentPieceX = computeLabelPiecesPositions(
        nodeById(edge.parentNodeId, nodes).pieces,
        connectorPlaceholder,
        style.fontSize,
        style.fontFamily,
      )[edge.parentPieceId];
      const parentPos = computeEdgeParentPos(
        edge.parentNodeId,
        parentPieceX,
        nodes,
        style.fontSize,
        style.fontFamily,
      );
      const newDragEdge = {
        originalEdgeId: edge.id,
        updateParent: false,
        parentNodeId: edge.parentNodeId,
        parentPieceId: edge.parentPieceId,
        parentX: parentPos.x,
        parentY: parentPos.y - textHeight / 2,
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
  };

  // Handle drag start event from a node hole connector by setting up the corresponding DragEdge
  const handlePlaceholderConnectorDragStart = (nodeId, pieceId, x, y) => {
    if (addingNode) {
      clearAdding();
    }

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
  };

  // Handle maouse move envents on stage checking if we are dragging a DragEdge,
  // moving the correct DragEdge end, or if we are dragging the multiple selection
  // rectangle while pressing a meta key
  const handleStageMouseMove = (e) => {
    e.cancelBubble = true;
    if (dragEdge) {
      setCursor('grabbing');
      const stagePos = stageRef.current.absolutePosition();
      const pointerPos = stageRef.current.getPointerPosition();
      const stageScale = stageRef.current.scale();
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
    }
    if (isDraggingSelectionRect && isPressingMetaOrShift) {
      setCursor('grabbing');
      const stagePos = stageRef.current.absolutePosition();
      const pointerPos = stageRef.current.getPointerPosition();
      const stageScale = stageRef.current.scale();
      setSelectionRectEndPos({
        x: (pointerPos.x - stagePos.x) / stageScale.x,
        y: (pointerPos.y - stagePos.y) / stageScale.y,
      });
    }
  };

  // Handle stage mouse up event adding/updating an edge if we were dragging a DragEdge,
  // otherwise set up the multiple selection created dragging the selection rectangle
  const handleStageMouseUp = (e) => {
    e.cancelBubble = true;
    if (dragEdge) {
      const stagePos = stageRef.current.absolutePosition();
      const pointerPos = stageRef.current.getPointerPosition();
      const stageScale = stageRef.current.scale();
      // If we are dragging the DragEdge from a hole connector
      if (dragEdge.updateParent) {
        const parentPiece = closestParentPiece(
          (pointerPos.x - stagePos.x) / stageScale.x,
          (pointerPos.y - stagePos.y) / stageScale.y,
          nodes,
          connectorPlaceholder,
          style.fontSize,
          style.fontFamily,
        );
        // If we are updating an already existing edge
        if (dragEdge.originalEdgeId) {
          const originalEdge = edgeById(dragEdge.originalEdgeId, edges);
          // If we dropped the DragEdge on a valid location
          if (
            parentPiece
            && originalEdge.childNodeId !== parentPiece.parentNodeId
            && (originalEdge.parentNodeId !== parentPiece.parentNodeId
              || originalEdge.parentPieceId !== parentPiece.parentPieceId)
          ) {
            const foundEdges = edgeByParentPiece(
              parentPiece.parentNodeId,
              parentPiece.parentPieceId,
              edges,
            );
            // Check if the connector is empty, or if it is not,
            // check if we are allowing multiple edges on the same connector
            if (
              (foundEdges.length > 0
                && allowedErrors.multiEdgeOnHoleConnector)
              || foundEdges.length === 0
            ) {
              setCursor('grab');
              clearDragEdge();
              setSelectedEdgeRef(null);
              clearEdgeSelection();
              const newEdge = {
                id: originalEdge.id,
                childNodeId: originalEdge.childNodeId,
                parentNodeId: parentPiece.parentNodeId,
                parentPieceId: parentPiece.parentPieceId,
              };
              // eslint-disable-next-line no-unused-vars
              const [visitedBranch, creatingLoop] = checkIsCreatingLoop(
                nodeById(originalEdge.childNodeId, nodes),
                [parentPiece.parentNodeId],
                false,
              );
              // Check if the new edge is creating a loop,
              // if the new edge is not creating a loop,
              // or if we are allowing loops to be created, complete the edge update
              if ((allowedErrors.loop && creatingLoop) || !creatingLoop) {
                updateEdge({
                  edgeId: originalEdge.id,
                  newEdge,
                  onEdgeUpdate,
                });
                stageRef.current
                  .find('.Edge')
                  .toArray()
                  .map((edge) => edge.moveToBottom());
              }
            }
            // If we are dropping the DragEdge on an invalid location,
            // clear the DragEdge and remove the original edge
          } else if (!parentPiece) {
            setCursor('move');
            clearDragEdge();
            setSelectedEdgeRef(null);
            removeEdge({ edgeId: originalEdge.id, onEdgeDelete });
          }
          // If we are dragging from an empty connector without existing edges
        } else {
          // If we dropped the DragEdge on a valid location
          if (
            parentPiece
            && dragEdge.childNodeId !== parentPiece.parentNodeId
          ) {
            const foundEdges = edgeByParentPiece(
              parentPiece.parentNodeId,
              parentPiece.parentPieceId,
              edges,
            );
            // Check if the connector is empty, or if it is not,
            // check if we are allowing multiple edges on the same connector
            if (
              (foundEdges.length > 0
                && allowedErrors.multiEdgeOnHoleConnector)
              || foundEdges.length === 0
            ) {
              setCursor('grab');
              const newEdge = {
                childNodeId: dragEdge.childNodeId,
                parentNodeId: parentPiece.parentNodeId,
                parentPieceId: parentPiece.parentPieceId,
              };
              clearDragEdge();
              // eslint-disable-next-line no-unused-vars
              const [visitedBranch, creatingLoop] = checkIsCreatingLoop(
                nodeById(dragEdge.childNodeId, nodes),
                [parentPiece.parentNodeId],
                false,
              );
              // Check if the new edge is creating a loop,
              // if the new edge is not creating a loop,
              // or if we are allowing loops to be created, complete the edge adding
              if ((allowedErrors.loop && creatingLoop) || !creatingLoop) {
                addEdge({ edge: newEdge, onEdgeAdd });
                stageRef.current
                  .find('.Edge')
                  .toArray()
                  .map((edge) => edge.moveToBottom());
              }
            }
            // If we are dropping the DragEdge on an invalid location, clear the DragEdge
          } else {
            setCursor('move');
            clearDragEdge();
          }
        }
        // If we are dragging the DragEdge from a node connector
      } else {
        const childNodeId = closestChildId(
          (pointerPos.x - stagePos.x) / stageScale.x,
          (pointerPos.y - stagePos.y) / stageScale.y,
          nodes,
          style.fontSize,
          style.fontFamily,
        );
        // If we are updating an already existing edge
        if (dragEdge.originalEdgeId) {
          const originalEdge = edgeById(dragEdge.originalEdgeId, edges);
          // If we dropped the DragEdge on a valid location
          if (
            childNodeId
            && childNodeId !== originalEdge.parentNodeId
            && originalEdge.childNodeId !== childNodeId
          ) {
            const foundEdges = edgeByChildNode(childNodeId, edges);
            // Check if the connector is empty, or if it is not,
            // check if we are allowing multiple edges on the same connector
            if (
              (foundEdges.length > 0
                && allowedErrors.multiEdgeOnNodeConnector)
              || foundEdges.length === 0
            ) {
              setCursor('grab');
              clearDragEdge();
              setSelectedEdgeRef(null);
              clearEdgeSelection();
              const newEdge = {
                id: originalEdge.id,
                parentNodeId: originalEdge.parentNodeId,
                parentPieceId: originalEdge.parentPieceId,
                childNodeId,
              };
              // eslint-disable-next-line no-unused-vars
              const [visitedBranch, creatingLoop] = checkIsCreatingLoop(
                nodeById(childNodeId, nodes),
                [originalEdge.parentNodeId],
                false,
              );
              // Check if the new edge is creating a loop,
              // if the new edge is not creating a loop,
              // or if we are allowing loops to be created, complete the edge update
              if ((allowedErrors.loop && creatingLoop) || !creatingLoop) {
                updateEdge({
                  edgeId: dragEdge.originalEdgeId,
                  newEdge,
                  onEdgeUpdate,
                });
                stageRef.current
                  .find('.Edge')
                  .toArray()
                  .map((edge) => edge.moveToBottom());
              }
            }
            // If we are dropping the DragEdge on an invalid location,
            // clear the DragEdge and remove the original edge
          } else if (!childNodeId) {
            setCursor('move');
            clearDragEdge();
            setSelectedEdgeRef(null);
            removeEdge({ edgeId: originalEdge.id, onEdgeDelete });
          }
          // If we are dragging from an empty connector without existing edges
        } else {
          // If we dropped the DragEdge on a valid location
          if (childNodeId && dragEdge.parentNodeId !== childNodeId) {
            const foundEdges = edgeByChildNode(childNodeId, edges);
            // Check if the connector is empty, or if it is not,
            // check if we are allowing multiple edges on the same connector
            if (
              (foundEdges.length > 0
                && allowedErrors.multiEdgeOnNodeConnector)
              || foundEdges.length === 0
            ) {
              setCursor('grab');
              const newEdge = {
                parentNodeId: dragEdge.parentNodeId,
                parentPieceId: dragEdge.parentPieceId,
                childNodeId,
              };
              clearDragEdge();
              // eslint-disable-next-line no-unused-vars
              const [visitedBranch, creatingLoop] = checkIsCreatingLoop(
                nodeById(childNodeId, nodes),
                [dragEdge.parentNodeId],
                false,
              );
              // Check if the new edge is creating a loop,
              // if the new edge is not creating a loop,
              // or if we are allowing loops to be created, complete the edge adding
              if ((allowedErrors.loop && creatingLoop) || !creatingLoop) {
                addEdge({ edge: newEdge, onEdgeAdd });
                stageRef.current
                  .find('.Edge')
                  .toArray()
                  .map((edge) => edge.moveToBottom());
              }
            }
            // If we are dropping the DragEdge on an invalid location, clear the DragEdge
          } else {
            setCursor('move');
            clearDragEdge();
          }
        }
      }
      clearDragEdge();
    }
    // If we were dragging the multiple selection rectangle
    if (isDraggingSelectionRect && isPressingMetaOrShift) {
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
    }
  };

  // Handle stage click event, if the adding node button has been pressed,
  // add the new node at the clicked location, otherwise clear all selections
  const handleStageClick = (e) => {
    if (addingNode) {
      const stagePos = stageRef.current.absolutePosition();
      const pointerPos = stageRef.current.getPointerPosition();
      const stageScale = stageRef.current.scale();
      const nodeWidth = computeNodeWidth(
        addValue,
        connectorPlaceholder,
        style.fontSize,
        style.fontFamily,
      );
      addNode({
        pieces: addValue,
        x: (pointerPos.x - stagePos.x) / stageScale.x,
        y: (pointerPos.y - stagePos.y) / stageScale.y,
        width: nodeWidth,
        type: '',
        value: '',
        isFinal: false,
        onNodeAdd,
      });
      clearAdding();
    } else {
      transformerRef.current.nodes([]);
      setIsSelectedRectVisible(false);
      if (selectedNode) {
        clearNodeSelection();
      }
      if (selectedEdge) {
        selectedEdgeRef.moveToBottom();
        setSelectedEdgeRef(null);
        clearEdgeSelection();
      }
    }
  };

  // Handle node click event, if the adding node button has been pressed,
  // add the new node at the clicked location, otherwise select the clicked node,
  // and setup the edit node field on the side drawer
  const handleNodeClick = (e, nodeId) => {
    if (addingNode) {
      const stagePos = stageRef.current.absolutePosition();
      const pointerPos = stageRef.current.getPointerPosition();
      const stageScale = stageRef.current.scale();
      const nodeWidth = computeNodeWidth(
        addValue,
        connectorPlaceholder,
        style.fontSize,
        style.fontFamily,
      );
      addNode({
        pieces: addValue,
        x: (pointerPos.x - stagePos.x) / stageScale.x,
        y: (pointerPos.y - stagePos.y) / stageScale.y,
        width: nodeWidth,
        type: '',
        value: '',
        isFinal: false,
        onNodeAdd,
      });
      clearAdding();
    } else {
      e.currentTarget.moveToTop();
      const selectingNode = nodeById(nodeId, nodes);
      if (selectedEdge) {
        selectedEdgeRef.moveToBottom();
        setSelectedEdgeRef(null);
        clearEdgeSelection();
      }
      if (!selectedNode || selectedNode.id !== selectingNode.id) {
        selectNode({ selectedNode: selectingNode, onNodeSelect });
        if (drawerFields.editField) {
          if (!selectingNode.isFinal) {
            document.getElementById(
              'editField',
            ).value = selectingNode.pieces.join('');
            editValueChange({ editValue: selectingNode.pieces });
          }
          typeValueChange({ typeValue: selectingNode.type });
          if (document.getElementById('valueField')) {
            document.getElementById('valueField').value = selectingNode.value;
          }
          nodeValueChange({ nodeValue: selectingNode.value });
        }
      }
    }
  };

  // Handle node double click event, selecting/deselecting the clicked node as root node
  const handleNodeDblClick = (nodeId) => {
    if (selectedRootNode && selectedRootNode.id === nodeId) {
      clearRootSelection();
    } else {
      const selectedRootNode = nodeById(nodeId, nodes);
      selectRootNode({ selectedRootNode });
    }
  };

  // Handle edge click event, if the adding node button has been pressed,
  // add the new node at the clicked location, otherwise select the clicked edge
  const handleEdgeClick = (e, edgeId) => {
    if (addingNode) {
      const stagePos = stageRef.current.absolutePosition();
      const pointerPos = stageRef.current.getPointerPosition();
      const stageScale = stageRef.current.scale();
      const nodeWidth = computeNodeWidth(
        addValue,
        connectorPlaceholder,
        style.fontSize,
        style.fontFamily,
      );
      addNode({
        pieces: addValue,
        x: (pointerPos.x - stagePos.x) / stageScale.x,
        y: (pointerPos.y - stagePos.y) / stageScale.y,
        width: nodeWidth,
        type: '',
        value: '',
        isFinal: false,
        onNodeAdd,
      });
      clearAdding();
    } else {
      e.cancelBubble = true;
      if (selectedNode) {
        clearNodeSelection();
      }
      if (!selectedEdge) {
        e.currentTarget.moveToTop();
        const selectingEdge = edgeById(edgeId, edges);
        setSelectedEdgeRef(e.currentTarget);
        selectEdge({ selectedEdge: selectingEdge, onEdgeSelect });
      } else if (selectedEdgeRef !== e.currentTarget) {
        selectedEdgeRef.moveToBottom();
        e.currentTarget.moveToTop();
        const selectingEdge = edgeById(edgeId, edges);
        setSelectedEdgeRef(e.currentTarget);
        selectEdge({
          selectedEdge: selectingEdge,
          onEdgeSelect,
        });
      }
    }
  };

  // Handle stage mouse down event if we are pressing a meta key,
  // setting up the starting coordinates of the multiple selection rectangle
  const handleStageMouseDown = (e) => {
    if (isPressingMetaOrShift) {
      e.cancelBubble = true;
      setCursor('grabbing');
      const stagePos = stageRef.current.absolutePosition();
      const pointerPos = stageRef.current.getPointerPosition();
      const stageScale = stageRef.current.scale();
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
  };

  // Handle stage drag move event, updating the stage position to the event coordinates
  const handleStageDragMove = (e) => {
    e.cancelBubble = true;
    const newPos = e.target.absolutePosition();
    stageRef.current.position({ x: newPos.x, y: newPos.y });
  };

  // Handle stage wheel event, zooming in/out the stage scale according to the pointer position
  const handleStageWheel = (e) => {
    clearWheelTimeout();
    e.evt.preventDefault();

    e.evt.deltaY < 0
      ? (setCursor('zoom-in'))
      : (setCursor('zoom-out'));

    const stage = stageRef.current;

    const scaleBy = 1.03;
    const oldScale = stage.scaleX();
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    const pointerPos = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointerPos.x - stage.x()) / oldScale,
      y: (pointerPos.y - stage.y()) / oldScale,
    };

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointerPos.x - mousePointTo.x * newScale,
      y: pointerPos.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
    setWheelTimeout();
  };

  // Timeout functions to set the cursor back to normal after a wheel event
  let wheelTimeout;
  const setWheelTimeout = () => {
    wheelTimeout = setTimeout(() => {
      setCursor('move');
    }, 300);
  };
  const clearWheelTimeout = () => {
    clearTimeout(wheelTimeout);
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

  const computeStageWidth = () => width || containerWidth;

  return (
    // Provide the theme to all the child elements
    <ThemeProvider theme={theme}>
      {/* Editor container element, necessary for the modals and alerts
      to appear relative to the container and not relative to the viewport */}
      <div
        ref={containerRef}
        role="tab"
        id="editorContainer"
        style={{
          position: 'relative',
          width: width || '100%',
          border: style.container.border,
          borderRadius: style.container.borderRadius,
          backgroundColor: style.container.backgroundColor,
        }}
        tabIndex={0}
        onKeyDown={!fullDisabled && handleKeyDown}
        onKeyUp={!fullDisabled && handleKeyUp}
      >
        {/* Top and side bar component */}
        <StageDrawer
          stageRef={stageRef}
          layerRef={layerRef}
          transformerRef={transformerRef}
          selectedEdgeRef={selectedEdgeRef}
          setSelectedEdgeRef={setSelectedEdgeRef}
          setIsSelectedRectVisible={setIsSelectedRectVisible}
          setCurrentErrorLocation={setCurrentErrorLocation}
          initialState={initialState}
          fontSize={style.fontSize}
          fontFamily={style.fontFamily}
          textHeight={textHeight}
          yPad={style.node.paddingY}
          toolbarButtons={toolbarButtons}
          drawerFields={drawerFields}
          fullDisabled={fullDisabled}
          connectorPlaceholder={connectorPlaceholder}
          templateNodes={templateNodes}
          nodeTypes={nodeTypes}
          reportedErrors={reportedErrors}
          onNodePiecesChange={onNodePiecesChange}
          onNodeTypeChange={onNodeTypeChange}
          onNodeValueChange={onNodeValueChange}
          onValidate={onValidate}
          selectedNode={selectedNode}
          editValue={editValue}
          addingNode={addingNode}
          typeValue={typeValue}
          nodes={nodes}
          selectedRootNode={selectedRootNode}
          nodeValue={nodeValue}
          edges={edges}
          editNode={editNode}
          addingNodeClick={addingNodeClick}
          addValueChange={addValueChange}
          nodeTypeEdit={nodeTypeEdit}
          nodeValueEdit={nodeValueEdit}
          stageReset={stageReset}
          uploadState={uploadState}
          reorderNodes={reorderNodes}
          editValueChange={editValueChange}
          nodeValueChange={nodeValueChange}
          typeValueChange={typeValueChange}
          // TODO: undo / redo
          // edges: state.editor.present.edges,
          // nodes: state.editor.present.nodes,
          // selectedRootNode: state.editor.present.selectedRootNode,
          // isAddEmpty: state.drawer.addValue.length < 1,
          // isEditEmpty: state.drawer.editValue.length < 1,
          // canUndo: state.editor.past.length > 0,
          // canRedo: state.editor.future.length > 0,
        />
        {/* Stage component containing the layer component */}
        <Stage
          ref={stageRef}
          width={computeStageWidth()}
          height={height}
          style={{ cursor: addingNode && 'crosshair' }}
          onMouseMove={!fullDisabled && handleStageMouseMove}
          onTouchMove={!fullDisabled && handleStageMouseMove}
          onMouseUp={!fullDisabled && handleStageMouseUp}
          onTouchEnd={!fullDisabled && handleStageMouseUp}
          onClick={!fullDisabled && handleStageClick}
          onTouchStart={!fullDisabled && handleStageClick}
          draggable={!isPressingMetaOrShift && !fullDisabled}
          onMouseDown={!fullDisabled && handleStageMouseDown}
          onDragStart={
            !fullDisabled
            && ((e) => {
              setCursor('grabbing');
            })
          }
          onDragMove={!fullDisabled && ((e) => handleStageDragMove(e))}
          onDragEnd={
            !fullDisabled
            && ((e) => {
              setCursor('move');
            })
          }
          onWheel={!fullDisabled && handleStageWheel}
          onMouseOver={
            !fullDisabled
            && ((e) => {
              setCursor('move');
            })
          }
          onMouseLeave={
            !fullDisabled
            && ((e) => {
              setCursor('default');
            })
          }
        >
          {/* Layer component containing nodes, edges, dragEdge and selection rectangles components */}
          <Layer ref={layerRef}>
            {/* Map all the state edges */}
            {edges.map((edge) => (
              <Edge
                key={`Edge-${edge.id}`}
                id={edge.id}
                childX={nodePositionById(edge.childNodeId, nodes).x}
                childY={nodePositionById(edge.childNodeId, nodes).y}
                childNodeId={edge.childNodeId}
                childWidth={nodeById(edge.childNodeId, nodes).width}
                parentX={nodePositionById(edge.parentNodeId, nodes).x}
                parentY={nodePositionById(edge.parentNodeId, nodes).y}
                parentNodeId={edge.parentNodeId}
                parentPieceId={edge.parentPieceId}
                parentPieceX={
                  computeLabelPiecesPositions(
                    nodeById(edge.parentNodeId, nodes).pieces,
                    connectorPlaceholder,
                    style.fontSize,
                    style.fontFamily,
                  )[edge.parentPieceId]
                }
                isDragged={dragEdge && dragEdge.originalEdgeId === edge.id}
                isFullDisabled={fullDisabled}
                isDraggingSelectionRect={isDraggingSelectionRect}
                isSelected={selectedEdge && selectedEdge.id === edge.id}
                selectedEdgeRef={selectedEdgeRef}
                setSelectedEdgeRef={setSelectedEdgeRef}
                clearEdgeSelection={clearEdgeSelection}
                currentErrorLocation={currentErrorLocation}
                textHeight={textHeight}
                placeholderWidth={holeWidth}
                nodePaddingX={style.node.paddingX}
                nodePaddingY={style.node.paddingY}
                // Event Listeners
                onEdgeClick={(e) => handleEdgeClick(e, edge.id)}
                onNodeConnectorDragStart={handleNodeConnectorDragStart}
                onPlaceholderConnectorDragStart={handlePlaceholderConnectorDragStart}
                setCursor={setCursor}
                // Style
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

                stageRef={stageRef}
                transformerRef={transformerRef}
                selectedEdgeRef={selectedEdgeRef}
                setSelectedEdgeRef={setSelectedEdgeRef}
                isDraggingSelectionRect={isDraggingSelectionRect}
                isPressingMetaOrShift={isPressingMetaOrShift}
                currentErrorLocation={currentErrorLocation}
                nodeWidth={node.width}
                isSelected={selectedNode && selectedNode.id === node.id}
                isSelectedRoot={
                  selectedRootNode && selectedRootNode.id === node.id
                }
                type={node.type}
                value={node.value}
                isFinal={node.isFinal}
                nodes={nodes}
                edges={edges}
                stageWidth={containerWidth}
                stageHeight={height}
                placeholderWidth={holeWidth}
                textHeight={textHeight}
                connectorPlaceholder={connectorPlaceholder}
                fullDisabled={fullDisabled}
                moveNodeTo={moveNodeTo}
                moveNodeToEnd={moveNodeToEnd}
                removeNode={removeNode}
                clearNodeSelection={clearNodeSelection}
                clearEdgeSelection={clearEdgeSelection}
                nodeValueChange={nodeValueChange}

                setCursor={setCursor}
                // Event Listeners
                onNodeMove={onNodeMove}
                onNodeDelete={onNodeDelete}
                onNodeClick={(e) => handleNodeClick(e, node.id)}
                onNodeDblClick={() => handleNodeDblClick(node.id)}
                onNodeConnectorDragStart={handleNodeConnectorDragStart}
                onPlaceholderConnectorDragStart={handlePlaceholderConnectorDragStart}
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
              draggable
              onMouseEnter={() => {
                setCursor('grab');
              }}
              onDragStart={() => {
                setCursor('grabbing');
              }}
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
    </ThemeProvider>
  );
}

ExpressionTreeEditor.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,

  connectorPlaceholder: PropTypes.string,
  fullDisabled: PropTypes.bool,
  toolbarButtons: PropTypes.objectOf(PropTypes.bool),
  drawerFields: PropTypes.objectOf(PropTypes.bool),
  templateNodes: PropTypes.arrayOf(PropTypes.string),
  nodeTypes: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      any: PropTypes.bool,
      fixedValues: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
  allowedErrors: PropTypes.objectOf(PropTypes.bool),
  reportedErrors: PropTypes.objectOf(PropTypes.objectOf(PropTypes.bool)),
  initialState: PropTypes.shape({
    initialNodes: PropTypes.arrayOf(PropTypes.object).isRequired,
    initialEdges: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      pieces: PropTypes.arrayOf(PropTypes.string),
      x: PropTypes.number,
      y: PropTypes.number,
      type: PropTypes.string,
      value: PropTypes.string,
      isFinal: PropTypes.bool,
    }),
  ),
  selectedNode: PropTypes.shape({
    pieces: PropTypes.arrayOf(PropTypes.string),
    x: PropTypes.number,
    y: PropTypes.number,
    type: PropTypes.string,
    value: PropTypes.string,
    isFinal: PropTypes.bool,
  }),
  selectedRootNode: PropTypes.shape({
    pieces: PropTypes.arrayOf(PropTypes.string),
    x: PropTypes.number,
    y: PropTypes.number,
    type: PropTypes.string,
    value: PropTypes.string,
    isFinal: PropTypes.bool,
  }),
  edges: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)),
  selectedEdge: PropTypes.objectOf(PropTypes.number),
  dragEdge: PropTypes.shape({
    originalEdgeId: PropTypes.number,
    updateParent: PropTypes.bool,
    parentNodeId: PropTypes.number,
    parentPieceId: PropTypes.number,
    parentX: PropTypes.number,
    parentY: PropTypes.number,
    childX: PropTypes.number,
    childY: PropTypes.number,
  }),
  addValue: PropTypes.arrayOf(PropTypes.string),
  addingNode: PropTypes.bool,
  // EventListeners
  onNodeAdd: PropTypes.func,
  onNodeDelete: PropTypes.func,
  onNodeSelect: PropTypes.func,
  onNodeMove: PropTypes.func,
  onNodePiecesChange: PropTypes.func,
  onNodeTypeChange: PropTypes.func,
  onNodeValueChange: PropTypes.func,
  onEdgeAdd: PropTypes.func,
  onEdgeDelete: PropTypes.func,
  onEdgeUpdate: PropTypes.func,
  onEdgeSelect: PropTypes.func,
  onValidate: PropTypes.func,
  // Style
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
      placeholderColor: PropTypes.string,
      tagColor: PropTypes.string,
      textColor: PropTypes.string,
      deleteButtonColor: PropTypes.string,
      star: PropTypes.exact({
        strokeSize: PropTypes.number,
        strokeColor: PropTypes.string,
        numPoints: PropTypes.number,
        innerRadius: PropTypes.number,
        outerRadius: PropTypes.number,
      }),
      delete: PropTypes.exact({
        paddingX: PropTypes.number,
        fontSize: PropTypes.number,
        text: PropTypes.string,
        textColor: PropTypes.string,
        overTextColor: PropTypes.string,
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

  connectorPlaceholder: '{{}}',
  templateNodes: [],
  initialState: { initialNodes: [], initialEdges: [] },
  nodeTypes: [
    { type: 'String', any: true, fixedValues: [] },
    { type: 'Number', any: true, fixedValues: [] },
    { type: 'Boolean', any: false, fixedValues: ['true', 'false'] },
    { type: 'Object', any: true, fixedValues: [] },
    { type: 'Undefined', any: false, fixedValues: ['undefined'] },
    { type: 'Null', any: false, fixedValues: ['null'] },
  ],
  allowedErrors: {
    loop: true,
    multiEdgeOnHoleConnector: true,
    multiEdgeOnNodeConnector: true,
  },
  reportedErrors: {
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
  toolbarButtons: {
    drawerButton: true,
    reset: true,
    undo: true,
    redo: true,
    reorder: true,
    validate: true,
    upload: true,
    screenshot: true,
    zoomIn: true,
    zoomOut: true,
    info: true,
    zoomToFit: true,
    fullScreen: true,
  },
  drawerFields: { addField: true, editField: true },
  fullDisabled: false,
  // Event Listeners
  onNodeAdd: null,
  onNodeDelete: null,
  onNodeSelect: null,
  onNodeMove: null,
  onNodePiecesChange: null,
  onNodeTypeChange: null,
  onNodeValueChange: null,
  onEdgeAdd: null,
  onEdgeDelete: null,
  onEdgeUpdate: null,
  onEdgeSelect: null,
  onValidate: null,
  // Style
  style: {
    fontSize: 24,
    fontFamily: 'Roboto Mono, Courier',
    selectionRectColor: 'rgba(0,0,255,0.2)',
    node: {
      paddingX: 12,
      paddingY: 12,
      radius: 5,
      strokeColor: '#000000',
      strokeWidth: 1,
      strokeSelectedWidth: 2,
      fillColor: '#208020',
      errorColor: '#ff2f2f',
      selectedColor: '#3f51b5',
      finalColor: '#208080',
      placeholderColor: '#104010',
      tagColor: '#3f51b5',
      textColor: 'white',
      deleteButtonColor: 'red',
      star: {
        strokeSize: 2,
        strokeColor: '#000000',
        numPoints: 5,
        innerRadius: 5,
        outerRadius: 10,
      },
      delete: {
        paddingX: 12,
        fontSize: 12,
        text: 'X',
        textColor: '#ffffff',
        overTextColor: '#ff2f2f',
      },
    },
    edge: {
      strokeSize: 6,
      color: '#000000',
      selectedColor: '#f2d200',
      draggingColor: '#f0f0f0',
      errorColor: '#ff2f2f',
      connector: {
        child: {
          radiusSize: 6,
          color: '#555555',
          emptyColor: 'black',
          selectedColor: '#f2a200',
          draggingColor: '#f0f0f0',
          errorColor: '#ff2f2f',
          strokeSize: 1,
          strokeColor: '#000000',
        },
        parent: {
          radiusSize: 6,
          color: '#555555',
          selectedColor: '#f2a200',
          draggingColor: '#f0f0f0',
          errorColor: '#ff2f2f',
          strokeSize: 1,
          strokeColor: '#000000',
        },
      },
    },
    dragEdge: {
      strokeSize: 6,
      color: '#000000',
      connector: {
        child: {
          radiusSize: 6,
          color: '#ff2f2f',
          strokeSize: 1,
          strokeColor: '#000000',
        },
        parent: {
          radiusSize: 6,
          color: '#ff2f2f',
          strokeSize: 1,
          strokeColor: '#000000',
        },
      },
    },
    toolbar: {
      primaryColor: '#3f51b5',
      secondaryColor: '#f50057',
    },
    container: {
      border: '2px solid #3f50b5',
      borderRadius: '5px',
      backgroundColor: 'white',
    },
  },
};

export default ExpressionTreeEditor;
