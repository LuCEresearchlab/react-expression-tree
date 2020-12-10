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
  // Get access to DOM node corresponding to <Stage>
  // because we need to get key events from the DOM
  // (Konva doesn't provide key events).
  const stageRef = useRef();
  const layerRef = useRef();
  const selectionRectRef = useRef();
  const selectedRectRef = useRef();
  const transformerRef = useRef();

  const dispatch = useDispatch();

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: toolbarPrimaryColor || "#3f51b5",
      },
      secondary: { main: toolbarSecondaryColor || "#f50057" },
    },
  });

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

  useEffect(() => {
    // Request focus, so we can respond to key events
    const stage = stageRef.current;
    stage.container().tabIndex = 1;
    stage.container().focus();
    // Register (and later unregister) keydown listener
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

  const handlePieceConnectorDragStart = (nodeId, pieceId, x, y) => {
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

  const handleStageMouseUp = e => {
    e.cancelBubble = true;
    if (dragEdge) {
      const stagePos = stageRef.current.absolutePosition();
      const pointerPos = stageRef.current.getPointerPosition();
      const stageScale = stageRef.current.scale();
      if (dragEdge.updateParent) {
        const parentPiece = closestParentPiece(
          (pointerPos.x - stagePos.x) / stageScale.x,
          (pointerPos.y - stagePos.y) / stageScale.y,
          nodes,
          connectorPlaceholder,
          fontSize,
          fontFamily
        );
        if (dragEdge.originalEdgeId) {
          const originalEdge = edgeById(dragEdge.originalEdgeId, edges);
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
            if (
              (foundEdges.length > 0 &&
                allowedErrors &&
                allowedErrors.multiEdgeOnPieceConnector) ||
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
                type: "",
              };
              // eslint-disable-next-line no-unused-vars
              const [visitedBranch, creatingLoop] = checkIsCreatingLoop(
                nodeById(originalEdge.childNodeId, nodes),
                [parentPiece.parentNodeId],
                false
              );
              if (
                (allowedErrors && allowedErrors.loop && creatingLoop) ||
                !creatingLoop
              ) {
                updateEdge({
                  edgeId: originalEdge.id,
                  newEdge: newEdge,
                  onEdgeUpdate: onEdgeUpdate,
                });
              }
            }
          } else if (!parentPiece) {
            document.body.style.cursor = "move";
            clearDragEdge();
            setSelectedEdgeRef(null);
            removeEdge({ edgeId: originalEdge.id, onEdgeDelete: onEdgeDelete });
          }
        } else {
          if (
            parentPiece &&
            dragEdge.childNodeId !== parentPiece.parentNodeId
          ) {
            const foundEdges = edgeByParentPiece(
              parentPiece.parentNodeId,
              parentPiece.parentPieceId,
              edges
            );
            if (
              (foundEdges.length > 0 &&
                allowedErrors &&
                allowedErrors.multiEdgeOnPieceConnector) ||
              foundEdges.length === 0
            ) {
              document.body.style.cursor = "grab";
              const newEdge = {
                childNodeId: dragEdge.childNodeId,
                parentNodeId: parentPiece.parentNodeId,
                parentPieceId: parentPiece.parentPieceId,
                type: "",
              };
              clearDragEdge();
              // eslint-disable-next-line no-unused-vars
              const [visitedBranch, creatingLoop] = checkIsCreatingLoop(
                nodeById(dragEdge.childNodeId, nodes),
                [parentPiece.parentNodeId],
                false
              );
              if (
                (allowedErrors && allowedErrors.loop && creatingLoop) ||
                !creatingLoop
              ) {
                addEdge({ edge: newEdge, onEdgeAdd: onEdgeAdd });
              }
            }
          } else {
            document.body.style.cursor = "move";
          }
        }
      } else {
        const childNodeId = closestChildId(
          (pointerPos.x - stagePos.x) / stageScale.x,
          (pointerPos.y - stagePos.y) / stageScale.y,
          nodes,
          fontSize,
          fontFamily
        );
        if (dragEdge.originalEdgeId) {
          const originalEdge = edgeById(dragEdge.originalEdgeId, edges);
          if (
            childNodeId &&
            childNodeId !== originalEdge.parentNodeId &&
            originalEdge.childNodeId !== childNodeId
          ) {
            const foundEdges = edgeByChildNode(childNodeId, edges);
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
                type: "",
              };
              // eslint-disable-next-line no-unused-vars
              const [visitedBranch, creatingLoop] = checkIsCreatingLoop(
                nodeById(childNodeId, nodes),
                [originalEdge.parentNodeId],
                false
              );
              if (
                (allowedErrors && allowedErrors.loop && creatingLoop) ||
                !creatingLoop
              ) {
                updateEdge({
                  edgeId: dragEdge.originalEdgeId,
                  newEdge: newEdge,
                  onEdgeUpdate: onEdgeUpdate,
                });
              }
            }
          } else if (!childNodeId) {
            document.body.style.cursor = "move";
            clearDragEdge();
            setSelectedEdgeRef(null);
            removeEdge({ edgeId: originalEdge.id, onEdgeDelete: onEdgeDelete });
          }
        } else {
          if (childNodeId && dragEdge.parentNodeId !== childNodeId) {
            const foundEdges = edgeByChildNode(childNodeId, edges);
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
                type: "",
              };
              clearDragEdge();
              // eslint-disable-next-line no-unused-vars
              const [visitedBranch, creatingLoop] = checkIsCreatingLoop(
                nodeById(childNodeId, nodes),
                [dragEdge.parentNodeId],
                false
              );
              if (
                (allowedErrors && allowedErrors.loop && creatingLoop) ||
                !creatingLoop
              ) {
                addEdge({ edge: newEdge, onEdgeAdd: onEdgeAdd });
              }
            }
          } else {
            document.body.style.cursor = "move";
          }
        }
      }
      clearDragEdge();
    }
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

  const handleNodeDblClick = nodeId => {
    if (selectedRootNode && selectedRootNode.id === nodeId) {
      clearRootSelection();
    } else {
      const selectedRootNode = nodeById(nodeId, nodes);
      selectRootNode({ selectedRootNode: selectedRootNode });
    }
  };

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

  const handleStageDragMove = e => {
    e.cancelBubble = true;
    const newPos = e.target.absolutePosition();
    stageRef.current.position({ x: newPos.x, y: newPos.y });
  };

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

  var wheelTimeout;
  const setWheelTimeout = () => {
    wheelTimeout = setTimeout(() => {
      document.body.style.cursor = "move";
    }, 300);
  };
  const clearWheelTimeout = () => {
    clearTimeout(wheelTimeout);
  };

  const handleSelectedDragMove = e => {
    e.cancelBubble = true;
    moveSelectedNodesTo({
      nodes: transformerRef.current.nodes(),
      delta: { x: e.evt.movementX, y: e.evt.movementY },
    });
  };

  const handleSelectedDragEnd = e => {
    e.cancelBubble = true;
    document.body.style.cursor = "grab";
    moveSelectedNodesToEnd({
      nodes: transformerRef.current.nodes(),
      delta: { x: e.evt.movementX, y: e.evt.movementY },
    });
  };

  return (
    <MuiThemeProvider theme={theme}>
      <div
        id="editorContainer"
        style={{
          position: "relative",
          border: "2px solid #3f50b5",
          borderRadius: "5px",
        }}
      >
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
        <Stage
          ref={stageRef}
          width={width}
          height={height}
          onMouseMove={!fullDisabled && handleStageMouseMove}
          onMouseUp={!fullDisabled && handleStageMouseUp}
          onClick={!fullDisabled && handleStageClick}
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
          <Layer ref={layerRef}>
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
                onPieceConnectorDragStart={handlePieceConnectorDragStart}
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
                onPieceConnectorDragStart={handlePieceConnectorDragStart}
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
            <Rect
              ref={selectionRectRef}
              fill="rgba(0,0,255,0.2)"
              x={Math.min(selectionRectStartPos.x, selectionRectEndPos.x)}
              y={Math.min(selectionRectStartPos.y, selectionRectEndPos.y)}
              width={Math.abs(selectionRectEndPos.x - selectionRectStartPos.x)}
              height={Math.abs(selectionRectEndPos.y - selectionRectStartPos.y)}
              visible={isSelectingRectVisible}
            />
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
            <Transformer
              ref={transformerRef}
              rotateEnabled={false}
              resizeEnabled={false}
              visible={isSelectedRectVisible}
            />
          </Layer>
        </Stage>
      </div>
    </MuiThemeProvider>
  );
}

export default ExpressionTreeEditor;
