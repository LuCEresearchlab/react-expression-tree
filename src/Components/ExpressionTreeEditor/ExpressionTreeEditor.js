import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ActionCreators } from "redux-undo";
import Node from "../Node.js";
import Edge from "../Edge.js";
import DragEdge from "../DragEdge.js";
import StageDrawer from "../StageDrawer";
import { Stage, Layer, Rect, Transformer } from "react-konva";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import {
  edgeByChildNode,
  computePiecesPositions,
  computeEdgeParentPos,
  edgeByParentPiece,
  computeEdgeChildPos,
  closestParentPiece,
  edgeById,
  closestChildId,
  nodeById,
  nodePositionById,
  computeNodeWidth,
} from "../../utils.js";

function ExpressionTreeEditor({
  width,
  height,
  fontSize,
  fontFamily,
  connectorPlaceholder,
  templateNodes,
  nodes,
  edges,
  dragEdge,
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
  clearNodeSelection,
  addNode,
  selectNode,
  selectedNode,
  addingNode,
  addValue,
  editValueChange,
  typeValueChange,
  nodeValueChange,
  clearAdding,
  selectEdge,
  clearEdgeSelection,
  selectedEdge,
  selectRootNode,
  selectedRootNode,
  clearRootSelection,
  initialState,
  setInitialState,
  nodeTypes,
  allowedErrors,
  reportedErrors,
  moveSelectedNodesTo,
  moveSelectedNodesToEnd,
  toolbarButtons,
  drawerFields,
  fullDisabled,
  onNodeAdd,
  onNodeDelete,
  onNodeSelect,
  onNodePiecesChange,
  onNodeTypeChange,
  onNodeValueChange,
  onEdgeAdd,
  onEdgeDelete,
  onEdgeUpdate,
  onEdgeSelect,
  onValidate,
  errorColor,
  nodeColor,
  selectedNodeColor,
  finalNodeColor,
  rootConnectorColor,
  nodeConnectorColor,
  nodeHoleColor,
  nodeTagColor,
  nodeTextColor,
  nodeDeleteButtonColor,
  edgeColor,
  edgeChildConnectorColor,
  edgeParentConnectorColor,
  selectedEdgeColor,
  draggingEdgeColor,
  dragEdgeColor,
  dragEdgeChildConnectorColor,
  dragEdgeParentConnectorColor,
  toolbarPrimaryColor,
  toolbarSecondaryColor,
}) {
  // Refs
  const stageRef = useRef();
  const layerRef = useRef();
  const selectionRectRef = useRef();
  const selectedRectRef = useRef();
  const transformerRef = useRef();

  const dispatch = useDispatch();

  // Set the theme primary and secondary colors according to the recived props
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: toolbarPrimaryColor || "#3f51b5",
      },
      secondary: { main: toolbarSecondaryColor || "#f50057" },
    },
  });

  // Layout utils
  const xPad = fontSize / 2;
  const yPad = fontSize / 2;
  const oText = new Konva.Text({
    text: "o",
    fontFamily: fontFamily,
    fontSize: fontSize,
  });
  const textHeight = oText.fontSize();
  const holeWidth = oText.getTextWidth();
  const nodeHeight = 2 * yPad + textHeight;

  // State hooks
  const [selectedEdgeRef, setSelectedEdgeRef] = useState(null);
  const [pressingMeta, setPressingMeta] = useState(false);
  const [draggingSelectionRect, setDraggingSelectionRect] = useState(false);
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
    initialState &&
      dispatch(
        setInitialState({
          initialNodes: initialState.initialNodes,
          initialEdges: initialState.initialEdges,
          connectorPlaceholder: connectorPlaceholder,
          fontSize: fontSize,
          fontFamily: fontFamily,
        })
      );
    dispatch(ActionCreators.clearHistory());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Key events effect
  useEffect(() => {
    // Request focus, so we can respond to key events
    const stage = stageRef.current;
    stage.container().tabIndex = 1;
    stage.container().focus();
    // Register (and later unregister) keydown and keyup listeners
    const keyDownListener = function (e) {
      if (e.key === "Backspace" || e.key === "Delete") {
        if (selectedNode && !selectedNode.isFinal) {
          clearNodeSelection();
          removeNode({ nodeId: selectedNode.id, onNodeDelete: onNodeDelete });
        } else if (selectedEdge) {
          setSelectedEdgeRef(null);
          clearEdgeSelection();
          removeEdge({ edgeId: selectedEdge.id, onEdgeDelete: onEdgeDelete });
        }
      } else if (e.key === "Escape") {
        if (addingNode) {
          clearAdding();
        } else if (selectedNode) {
          clearNodeSelection();
        } else if (selectedEdge) {
          selectedEdgeRef.moveToBottom();
          setSelectedEdgeRef(null);
          clearEdgeSelection();
        }
      } else if (e.key === "Meta" || e.key === "Shift") {
        document.body.style.cursor = "grab";
        setPressingMeta(true);
      }
    };
    const keyUpListener = function (e) {
      if (e.key === "Meta" || e.key === "Shift") {
        document.body.style.cursor = "move";
        setIsSelectingRectVisible(false);
        setDraggingSelectionRect(false);
        const allNodes = stageRef.current.find(".Node").toArray();
        const box = selectionRectRef.current.getClientRect();
        var intersectingNodes = allNodes.filter(node =>
          Konva.Util.haveIntersection(box, node.getClientRect())
        );
        intersectingNodes.map(intersectingNode =>
          intersectingNode.parent.moveToTop()
        );
        selectedRectRef.current.moveToTop();
        transformerRef.current.nodes(intersectingNodes);
        setIsSelectedRectVisible(true);
        selectedRectRef.current.moveToTop();
        setPressingMeta(false);
      }
    };
    // Add the event listeners only if the fullDisabled prop is not true
    if (!fullDisabled) {
      stage.container().addEventListener("keydown", keyDownListener);
      stage.container().addEventListener("keyup", keyUpListener);
    }
    return () => {
      stage.container().removeEventListener("keydown", keyDownListener);
      stage.container().removeEventListener("keyup", keyUpListener);
    };
  }, [
    addingNode,
    clearAdding,
    clearEdgeSelection,
    clearNodeSelection,
    fullDisabled,
    onEdgeDelete,
    onNodeDelete,
    removeEdge,
    removeNode,
    selectedEdge,
    selectedEdgeRef,
    selectedNode,
    setInitialState,
  ]);

  // Check if the edge that is going to be added/updated is going to create a loop
  // in the tree, by checking if we get to an already visited node on the walking branch
  // while performing an in order tree walk
  function checkIsCreatingLoop(node, visitedBranch, creatingLoop) {
    visitedBranch.push(node.id);
    node.pieces.forEach((piece, i) => {
      if (piece === connectorPlaceholder) {
        const childEdges = edgeByParentPiece(node.id, i, edges);
        childEdges.forEach(edge => {
          const childNode = nodeById(edge.childNodeId, nodes);
          if (visitedBranch.find(e => e === childNode.id) !== undefined) {
            creatingLoop = true;
            return [visitedBranch, creatingLoop];
          } else {
            [visitedBranch, creatingLoop] = checkIsCreatingLoop(
              childNode,
              visitedBranch,
              creatingLoop
            );
          }
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
      const parentPieceX = computePiecesPositions(
        nodeById(edge.parentNodeId, nodes).pieces,
        connectorPlaceholder,
        fontSize,
        fontFamily
      )[edge.parentPieceId];
      const parentPos = computeEdgeParentPos(
        edge.parentNodeId,
        parentPieceX,
        nodes,
        fontSize,
        fontFamily
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
  const handleHoleConnectorDragStart = (nodeId, pieceId, x, y) => {
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
  const handleStageMouseMove = e => {
    e.cancelBubble = true;
    if (dragEdge) {
      document.body.style.cursor = "grabbing";
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
    if (draggingSelectionRect && pressingMeta) {
      document.body.style.cursor = "grabbing";
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
  const handleStageMouseUp = e => {
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
          fontSize,
          fontFamily
        );
        // If we are updating an already existing edge
        if (dragEdge.originalEdgeId) {
          const originalEdge = edgeById(dragEdge.originalEdgeId, edges);
          // If we dropped the DragEdge on a valid location
          if (
            parentPiece &&
            originalEdge.childNodeId !== parentPiece.parentNodeId &&
            (originalEdge.parentNodeId !== parentPiece.parentNodeId ||
              originalEdge.parentPieceId !== parentPiece.parentPieceId)
          ) {
            const foundEdges = edgeByParentPiece(
              parentPiece.parentNodeId,
              parentPiece.parentPieceId,
              edges
            );
            // Check if the connector is empty, or if it is not,
            // check if we are allowing multiple edges on the same connector
            if (
              (foundEdges.length > 0 &&
                allowedErrors &&
                allowedErrors.multiEdgeOnHoleConnector) ||
              foundEdges.length === 0
            ) {
              document.body.style.cursor = "grab";
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
                false
              );
              // Check if the new edge is creating a loop,
              // if the new edge is not creating a loop,
              // or if we are allowing loops to be created, complete the edge update
              if (
                (allowedErrors && allowedErrors.loop && creatingLoop) ||
                !creatingLoop
              ) {
                updateEdge({
                  edgeId: originalEdge.id,
                  newEdge: newEdge,
                  onEdgeUpdate: onEdgeUpdate,
                });
                stageRef.current
                  .find(".Edge")
                  .toArray()
                  .map(edge => edge.moveToBottom());
              }
            }
            // If we are dropping the DragEdge on an invalid location,
            // clear the DragEdge and remove the original edge
          } else if (!parentPiece) {
            document.body.style.cursor = "move";
            clearDragEdge();
            setSelectedEdgeRef(null);
            removeEdge({ edgeId: originalEdge.id, onEdgeDelete: onEdgeDelete });
          }
          // If we are dragging from an empty connector without existing edges
        } else {
          // If we dropped the DragEdge on a valid location
          if (
            parentPiece &&
            dragEdge.childNodeId !== parentPiece.parentNodeId
          ) {
            const foundEdges = edgeByParentPiece(
              parentPiece.parentNodeId,
              parentPiece.parentPieceId,
              edges
            );
            // Check if the connector is empty, or if it is not,
            // check if we are allowing multiple edges on the same connector
            if (
              (foundEdges.length > 0 &&
                allowedErrors &&
                allowedErrors.multiEdgeOnHoleConnector) ||
              foundEdges.length === 0
            ) {
              document.body.style.cursor = "grab";
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
                false
              );
              // Check if the new edge is creating a loop,
              // if the new edge is not creating a loop,
              // or if we are allowing loops to be created, complete the edge adding
              if (
                (allowedErrors && allowedErrors.loop && creatingLoop) ||
                !creatingLoop
              ) {
                addEdge({ edge: newEdge, onEdgeAdd: onEdgeAdd });
                stageRef.current
                  .find(".Edge")
                  .toArray()
                  .map(edge => edge.moveToBottom());
              }
            }
            // If we are dropping the DragEdge on an invalid location, clear the DragEdge
          } else {
            document.body.style.cursor = "move";
            clearDragEdge();
          }
        }
        // If we are dragging the DragEdge from a node connector
      } else {
        const childNodeId = closestChildId(
          (pointerPos.x - stagePos.x) / stageScale.x,
          (pointerPos.y - stagePos.y) / stageScale.y,
          nodes,
          fontSize,
          fontFamily
        );
        // If we are updating an already existing edge
        if (dragEdge.originalEdgeId) {
          const originalEdge = edgeById(dragEdge.originalEdgeId, edges);
          // If we dropped the DragEdge on a valid location
          if (
            childNodeId &&
            childNodeId !== originalEdge.parentNodeId &&
            originalEdge.childNodeId !== childNodeId
          ) {
            const foundEdges = edgeByChildNode(childNodeId, edges);
            // Check if the connector is empty, or if it is not,
            // check if we are allowing multiple edges on the same connector
            if (
              (foundEdges.length > 0 &&
                allowedErrors &&
                allowedErrors.multiEdgeOnNodeConnector) ||
              foundEdges.length === 0
            ) {
              document.body.style.cursor = "grab";
              clearDragEdge();
              setSelectedEdgeRef(null);
              clearEdgeSelection();
              const newEdge = {
                id: originalEdge.id,
                parentNodeId: originalEdge.parentNodeId,
                parentPieceId: originalEdge.parentPieceId,
                childNodeId: childNodeId,
              };
              // eslint-disable-next-line no-unused-vars
              const [visitedBranch, creatingLoop] = checkIsCreatingLoop(
                nodeById(childNodeId, nodes),
                [originalEdge.parentNodeId],
                false
              );
              // Check if the new edge is creating a loop,
              // if the new edge is not creating a loop,
              // or if we are allowing loops to be created, complete the edge update
              if (
                (allowedErrors && allowedErrors.loop && creatingLoop) ||
                !creatingLoop
              ) {
                updateEdge({
                  edgeId: dragEdge.originalEdgeId,
                  newEdge: newEdge,
                  onEdgeUpdate: onEdgeUpdate,
                });
                stageRef.current
                  .find(".Edge")
                  .toArray()
                  .map(edge => edge.moveToBottom());
              }
            }
            // If we are dropping the DragEdge on an invalid location,
            // clear the DragEdge and remove the original edge
          } else if (!childNodeId) {
            document.body.style.cursor = "move";
            clearDragEdge();
            setSelectedEdgeRef(null);
            removeEdge({ edgeId: originalEdge.id, onEdgeDelete: onEdgeDelete });
          }
          // If we are dragging from an empty connector without existing edges
        } else {
          // If we dropped the DragEdge on a valid location
          if (childNodeId && dragEdge.parentNodeId !== childNodeId) {
            const foundEdges = edgeByChildNode(childNodeId, edges);
            // Check if the connector is empty, or if it is not,
            // check if we are allowing multiple edges on the same connector
            if (
              (foundEdges.length > 0 &&
                allowedErrors &&
                allowedErrors.multiEdgeOnNodeConnector) ||
              foundEdges.length === 0
            ) {
              document.body.style.cursor = "grab";
              const newEdge = {
                parentNodeId: dragEdge.parentNodeId,
                parentPieceId: dragEdge.parentPieceId,
                childNodeId: childNodeId,
              };
              clearDragEdge();
              // eslint-disable-next-line no-unused-vars
              const [visitedBranch, creatingLoop] = checkIsCreatingLoop(
                nodeById(childNodeId, nodes),
                [dragEdge.parentNodeId],
                false
              );
              // Check if the new edge is creating a loop,
              // if the new edge is not creating a loop,
              // or if we are allowing loops to be created, complete the edge adding
              if (
                (allowedErrors && allowedErrors.loop && creatingLoop) ||
                !creatingLoop
              ) {
                addEdge({ edge: newEdge, onEdgeAdd: onEdgeAdd });
                stageRef.current
                  .find(".Edge")
                  .toArray()
                  .map(edge => edge.moveToBottom());
              }
            }
            // If we are dropping the DragEdge on an invalid location, clear the DragEdge
          } else {
            document.body.style.cursor = "move";
            clearDragEdge();
          }
        }
      }
      clearDragEdge();
    }
    // If we were dragging the multiple selection rectangle
    if (draggingSelectionRect && pressingMeta) {
      document.body.style.cursor = "move";
      setIsSelectingRectVisible(false);
      setDraggingSelectionRect(false);
      const allNodes = stageRef.current.find(".Node").toArray();
      const box = selectionRectRef.current.getClientRect();
      var intersectingNodes = allNodes.filter(node =>
        Konva.Util.haveIntersection(box, node.getClientRect())
      );
      intersectingNodes.map(intersectingNode =>
        intersectingNode.parent.moveToTop()
      );
      selectedRectRef.current.moveToTop();
      transformerRef.current.nodes(intersectingNodes);
      setIsSelectedRectVisible(true);
      selectedRectRef.current.moveToTop();
    }
  };

  // Handle stage click event, if the adding node button has been pressed,
  // add the new node at the clicked location, otherwise clear all selections
  const handleStageClick = e => {
    if (addingNode) {
      const stagePos = stageRef.current.absolutePosition();
      const pointerPos = stageRef.current.getPointerPosition();
      const stageScale = stageRef.current.scale();
      const nodeWidth = computeNodeWidth(
        addValue,
        connectorPlaceholder,
        fontSize,
        fontFamily
      );
      addNode({
        pieces: addValue,
        x: (pointerPos.x - stagePos.x) / stageScale.x,
        y: (pointerPos.y - stagePos.y) / stageScale.y,
        width: nodeWidth,
        type: "",
        value: "",
        isFinal: false,
        onNodeAdd: onNodeAdd,
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
        fontSize,
        fontFamily
      );
      addNode({
        pieces: addValue,
        x: (pointerPos.x - stagePos.x) / stageScale.x,
        y: (pointerPos.y - stagePos.y) / stageScale.y,
        width: nodeWidth,
        type: "",
        value: "",
        isFinal: false,
        onNodeAdd: onNodeAdd,
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
        selectNode({ selectedNode: selectingNode, onNodeSelect: onNodeSelect });
        if (drawerFields.editField) {
          if (!selectingNode.isFinal) {
            document.getElementById(
              "editField"
            ).value = selectingNode.pieces.join("");
            editValueChange({ editValue: selectingNode.pieces });
          }
          typeValueChange({ typeValue: selectingNode.type });
          if (document.getElementById("valueField")) {
            document.getElementById("valueField").value = selectingNode.value;
          }
          nodeValueChange({ nodeValue: selectingNode.value });
        }
      }
    }
  };

  // Handle node double click event, selecting/deselecting the clicked node as root node
  const handleNodeDblClick = nodeId => {
    if (selectedRootNode && selectedRootNode.id === nodeId) {
      clearRootSelection();
    } else {
      const selectedRootNode = nodeById(nodeId, nodes);
      selectRootNode({ selectedRootNode: selectedRootNode });
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
        fontSize,
        fontFamily
      );
      addNode({
        pieces: addValue,
        x: (pointerPos.x - stagePos.x) / stageScale.x,
        y: (pointerPos.y - stagePos.y) / stageScale.y,
        width: nodeWidth,
        type: "",
        value: "",
        isFinal: false,
        onNodeAdd: onNodeAdd,
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
        selectEdge({ selectedEdge: selectingEdge, onEdgeSelect: onEdgeSelect });
      } else {
        if (selectedEdgeRef !== e.currentTarget) {
          selectedEdgeRef.moveToBottom();
          e.currentTarget.moveToTop();
          const selectingEdge = edgeById(edgeId, edges);
          setSelectedEdgeRef(e.currentTarget);
          selectEdge({
            selectedEdge: selectingEdge,
            onEdgeSelect: onEdgeSelect,
          });
        }
      }
    }
  };

  // Handle stage mouse down event if we are pressing a meta key,
  // setting up the starting coordinates of the multiple selection rectangle
  const handleStageMouseDown = e => {
    if (pressingMeta) {
      e.cancelBubble = true;
      document.body.style.cursor = "grabbing";
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
      setDraggingSelectionRect(true);
      selectionRectRef.current.moveToTop();
    }
  };

  // Handle stage drag move event, updating the stage position to the event coordinates
  const handleStageDragMove = e => {
    e.cancelBubble = true;
    const newPos = e.target.absolutePosition();
    stageRef.current.position({ x: newPos.x, y: newPos.y });
  };

  // Handle stage wheel event, zooming in/out the stage scale according to the pointer position
  const handleStageWheel = e => {
    clearWheelTimeout();
    e.evt.preventDefault();

    e.evt.deltaY < 0
      ? (document.body.style.cursor = "zoom-in")
      : (document.body.style.cursor = "zoom-out");

    const stage = stageRef.current;

    const scaleBy = 1.03;
    const oldScale = stage.scaleX();
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    const pointerPos = stage.getPointerPosition();

    var mousePointTo = {
      x: (pointerPos.x - stage.x()) / oldScale,
      y: (pointerPos.y - stage.y()) / oldScale,
    };

    stage.scale({ x: newScale, y: newScale });

    var newPos = {
      x: pointerPos.x - mousePointTo.x * newScale,
      y: pointerPos.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
    setWheelTimeout();
  };

  // Timeout functions to set the cursor back to normal after a wheel event
  var wheelTimeout;
  const setWheelTimeout = () => {
    wheelTimeout = setTimeout(() => {
      document.body.style.cursor = "move";
    }, 300);
  };
  const clearWheelTimeout = () => {
    clearTimeout(wheelTimeout);
  };

  // Handle drag move event on multiple nodes selection,
  // updating the selected nodes positions
  const handleSelectedDragMove = e => {
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
  const handleSelectedDragEnd = e => {
    e.cancelBubble = true;
    document.body.style.cursor = "grab";
    moveSelectedNodesToEnd({
      nodes: transformerRef.current.nodes(),
      delta: { x: e.evt.movementX, y: e.evt.movementY },
    });
  };

  return (
    // Provide the theme to all the child elements
    <MuiThemeProvider theme={theme}>
      {/* Editor container element, necessary for the modals and alerts 
      to appear relative to the container and not relative to the viewport*/}
      <div
        id="editorContainer"
        style={{
          position: "relative",
          border: "2px solid #3f50b5",
          borderRadius: "5px",
          backgroundColor: "white",
        }}
      >
        {/* Top and side bar component */}
        <StageDrawer
          connectorPlaceholder={connectorPlaceholder}
          templateNodes={templateNodes}
          stageRef={stageRef}
          layerRef={layerRef}
          transformerRef={transformerRef}
          setIsSelectedRectVisible={setIsSelectedRectVisible}
          initialState={initialState}
          nodeTypes={nodeTypes}
          selectedEdgeRef={selectedEdgeRef}
          setSelectedEdgeRef={setSelectedEdgeRef}
          reportedErrors={reportedErrors}
          toolbarButtons={toolbarButtons}
          drawerFields={drawerFields}
          fullDisabled={fullDisabled}
          setCurrentErrorLocation={setCurrentErrorLocation}
          onNodePiecesChange={onNodePiecesChange}
          onNodeTypeChange={onNodeTypeChange}
          onNodeValueChange={onNodeValueChange}
          onValidate={onValidate}
          fontSize={fontSize}
          fontFamily={fontFamily}
          yPad={yPad}
          textHeight={textHeight}
        />
        {/* Stage component containing the layer component*/}
        <Stage
          ref={stageRef}
          width={width}
          height={height}
          onMouseMove={!fullDisabled && handleStageMouseMove}
          onTouchMove={!fullDisabled && handleStageMouseMove}
          onMouseUp={!fullDisabled && handleStageMouseUp}
          onTouchEnd={!fullDisabled && handleStageMouseUp}
          onClick={!fullDisabled && handleStageClick}
          onTouchStart={!fullDisabled && handleStageClick}
          style={{ cursor: addingNode && "crosshair" }}
          draggable={!pressingMeta && !fullDisabled}
          onMouseDown={!fullDisabled && handleStageMouseDown}
          onDragStart={
            !fullDisabled &&
            (e => {
              document.body.style.cursor = "grabbing";
            })
          }
          onDragMove={!fullDisabled && (e => handleStageDragMove(e))}
          onDragEnd={
            !fullDisabled &&
            (e => {
              document.body.style.cursor = "move";
            })
          }
          onWheel={!fullDisabled && handleStageWheel}
          onMouseOver={
            !fullDisabled &&
            (e => {
              document.body.style.cursor = "move";
            })
          }
          onMouseLeave={
            !fullDisabled &&
            (e => {
              document.body.style.cursor = "default";
            })
          }
        >
          {/* Layer component containing nodes, edges, dragEdge and selection rectangles components*/}
          <Layer ref={layerRef}>
            {/* Map all the state edges */}
            {edges.map((edge, i) => (
              <Edge
                key={"Edge-" + edge.id}
                id={edge.id}
                beingDragged={dragEdge && dragEdge.originalEdgeId === edge.id}
                parentPieceX={
                  computePiecesPositions(
                    nodeById(edge.parentNodeId, nodes).pieces,
                    connectorPlaceholder,
                    fontSize,
                    fontFamily
                  )[edge.parentPieceId]
                }
                childWidth={nodeById(edge.childNodeId, nodes).width}
                parentX={nodePositionById(edge.parentNodeId, nodes).x}
                parentY={nodePositionById(edge.parentNodeId, nodes).y}
                childX={nodePositionById(edge.childNodeId, nodes).x}
                childY={nodePositionById(edge.childNodeId, nodes).y}
                onEdgeClick={e => handleEdgeClick(e, edge.id)}
                onNodeConnectorDragStart={handleNodeConnectorDragStart}
                onPieceConnectorDragStart={handleHoleConnectorDragStart}
                selected={selectedEdge && selectedEdge.id === edge.id}
                parentNodeId={edge.parentNodeId}
                parentPieceId={edge.parentPieceId}
                childNodeId={edge.childNodeId}
                selectedEdgeRef={selectedEdgeRef}
                setSelectedEdgeRef={setSelectedEdgeRef}
                clearEdgeSelection={clearEdgeSelection}
                draggingSelectionRect={draggingSelectionRect}
                fullDisabled={fullDisabled}
                currentErrorLocation={currentErrorLocation}
                fontSize={fontSize}
                fontFamily={fontFamily}
                xPad={xPad}
                yPad={yPad}
                holeWidth={holeWidth}
                textHeight={textHeight}
                errorColor={errorColor}
                edgeColor={edgeColor}
                edgeChildConnectorColor={edgeChildConnectorColor}
                edgeParentConnectorColor={edgeParentConnectorColor}
                selectedEdgeColor={selectedEdgeColor}
                draggingEdgeColor={draggingEdgeColor}
              />
            ))}
            {/* Map all the state nodes */}
            {nodes.map((node, i) => (
              <Node
                id={node.id}
                key={"Node-" + node.id}
                stageRef={stageRef}
                transformerRef={transformerRef}
                edges={edges}
                nodes={nodes}
                connectorPlaceholder={connectorPlaceholder}
                x={nodePositionById(node.id, nodes).x}
                y={nodePositionById(node.id, nodes).y}
                nodeWidth={node.width}
                nodeHeight={nodeHeight}
                pieces={node.pieces}
                isSelected={selectedNode && selectedNode.id === node.id}
                isSelectedRoot={
                  selectedRootNode && selectedRootNode.id === node.id
                }
                type={node.type}
                value={node.value}
                stageWidth={width}
                stageHeight={height}
                moveNodeTo={moveNodeTo}
                moveNodeToEnd={moveNodeToEnd}
                clearNodeSelection={clearNodeSelection}
                clearEdgeSelection={clearEdgeSelection}
                removeNode={removeNode}
                onNodeClick={e => handleNodeClick(e, node.id)}
                onNodeDblClick={() => handleNodeDblClick(node.id)}
                onNodeConnectorDragStart={handleNodeConnectorDragStart}
                onPieceConnectorDragStart={handleHoleConnectorDragStart}
                selectedEdgeRef={selectedEdgeRef}
                setSelectedEdgeRef={setSelectedEdgeRef}
                nodeValueChange={nodeValueChange}
                isFinal={node.isFinal}
                pressingMeta={pressingMeta}
                draggingSelectionRect={draggingSelectionRect}
                fullDisabled={fullDisabled}
                currentErrorLocation={currentErrorLocation}
                onNodeDelete={onNodeDelete}
                onNodeSelect={onNodeSelect}
                fontSize={fontSize}
                fontFamily={fontFamily}
                xPad={xPad}
                yPad={yPad}
                holeWidth={holeWidth}
                textHeight={textHeight}
                errorColor={errorColor}
                nodeColor={nodeColor}
                selectedNodeColor={selectedNodeColor}
                finalNodeColor={finalNodeColor}
                rootConnectorColor={rootConnectorColor}
                nodeConnectorColor={nodeConnectorColor}
                nodeHoleColor={nodeHoleColor}
                nodeTagColor={nodeTagColor}
                nodeTextColor={nodeTextColor}
                nodeDeleteButtonColor={nodeDeleteButtonColor}
                edgeChildConnectorColor={edgeChildConnectorColor}
                edgeParentConnectorColor={edgeParentConnectorColor}
              />
            ))}
            {/* Multiple selection rectangle component */}
            <Rect
              ref={selectionRectRef}
              fill="rgba(0,0,255,0.2)"
              x={Math.min(selectionRectStartPos.x, selectionRectEndPos.x)}
              y={Math.min(selectionRectStartPos.y, selectionRectEndPos.y)}
              width={Math.abs(selectionRectEndPos.x - selectionRectStartPos.x)}
              height={Math.abs(selectionRectEndPos.y - selectionRectStartPos.y)}
              visible={isSelectingRectVisible}
            />
            {/* Multiple selected rectangle component */}
            <Rect
              ref={selectedRectRef}
              fill="rgba(0,0,255,0)"
              x={
                transformerRef.current &&
                stageRef.current &&
                (transformerRef.current.getClientRect().x -
                  stageRef.current.absolutePosition().x) /
                  stageRef.current.scale().x
              }
              y={
                transformerRef.current &&
                stageRef.current &&
                (transformerRef.current.getClientRect().y -
                  stageRef.current.absolutePosition().y) /
                  stageRef.current.scale().y
              }
              width={
                transformerRef.current &&
                transformerRef.current.getClientRect().width /
                  stageRef.current.scale().x
              }
              height={
                transformerRef.current &&
                transformerRef.current.getClientRect().height /
                  stageRef.current.scale().y
              }
              visible={isSelectedRectVisible}
              draggable
              onMouseEnter={() => {
                document.body.style.cursor = "grab";
              }}
              onDragStart={() => {
                document.body.style.cursor = "grabbing";
              }}
              onDragMove={handleSelectedDragMove}
              onDragEnd={handleSelectedDragEnd}
              onMouseDown={handleStageMouseDown}
            />
            {/* Transformer component attached to the multiple selected nodes */}
            <Transformer
              ref={transformerRef}
              rotateEnabled={false}
              resizeEnabled={false}
              visible={isSelectedRectVisible}
              x={
                transformerRef.current &&
                stageRef.current &&
                (transformerRef.current.getClientRect().x -
                  stageRef.current.absolutePosition().x) /
                  stageRef.current.scale().x
              }
              y={
                transformerRef.current &&
                stageRef.current &&
                (transformerRef.current.getClientRect().y -
                  stageRef.current.absolutePosition().y) /
                  stageRef.current.scale().y
              }
            />
            {/* DragEdge component */}
            {dragEdge && (
              <DragEdge
                key="DragEdge"
                parentX={dragEdge.parentX}
                parentY={dragEdge.parentY}
                childX={dragEdge.childX}
                childY={dragEdge.childY}
                fontSize={fontSize}
                dragEdgeColor={dragEdgeColor}
                dragEdgeChildConnectorColor={dragEdgeChildConnectorColor}
                dragEdgeParentConnectorColor={dragEdgeParentConnectorColor}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </MuiThemeProvider>
  );
}

export default ExpressionTreeEditor;
