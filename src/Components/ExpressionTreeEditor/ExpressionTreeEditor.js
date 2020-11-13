import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ActionCreators } from "redux-undo";
import Node from "../Node.js";
import Edge from "../Edge.js";
import DragEdge from "../DragEdge.js";
import StageDrawer from "../StageDrawer";
import { Stage, Layer } from "react-konva";
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
  textHeight,
} from "../../utils.js";

function ExpressionTreeEditor({
  width,
  height,
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
  clearAdding,
  selectEdge,
  clearEdgeSelection,
  selectedEdge,
  selectRootNode,
  selectedRootNode,
  clearRootSelection,
  initialState,
  setInitialState,
  edgeTypes,
  rootTypeValue,
  rootTypeValueChange,
  clearRootTypeValue,
}) {
  // Get access to DOM node corresponding to <Stage>
  // because we need to get key events from the DOM
  // (Konva doesn't provide key events).
  const stageRef = useRef();
  const dispatch = useDispatch();

  const [selectedEdgeRef, setSelectedEdgeRef] = useState(null);

  // Effects
  useEffect(() => {
    dispatch(
      setInitialState({
        initialNodes: initialState.initialNodes,
        initialEdges: initialState.initialEdges,
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
    const delListener = function (e) {
      if (e.key === "Backspace" || e.key === "Delete") {
        if (selectedNode !== null) {
          clearNodeSelection();
          removeNode({ nodeId: selectedNode.id });
        } else if (selectedEdge !== null) {
          setSelectedEdgeRef(null);
          clearEdgeSelection();
          removeEdge({ edgeId: selectedEdge.id });
        }
      }
    };
    const escListener = function (e) {
      if (e.key === "Escape") {
        if (addingNode) {
          clearAdding();
        } else if (selectedNode !== null) {
          clearNodeSelection();
        } else if (selectedEdge !== null) {
          selectedEdgeRef.moveToBottom();
          setSelectedEdgeRef(null);
          clearEdgeSelection();
        }
      }
    };
    stage.container().addEventListener("keydown", delListener);
    stage.container().addEventListener("keydown", escListener);
    return () => {
      stage.container().removeEventListener("keydown", delListener);
      stage.container().removeEventListener("keydown", escListener);
    };
  }, [
    addingNode,
    clearAdding,
    clearEdgeSelection,
    clearNodeSelection,
    removeEdge,
    removeNode,
    selectedEdge,
    selectedEdgeRef,
    selectedNode,
    setInitialState,
  ]);

  const handleNodeConnectorDragStart = (nodeId, x, y) => {
    clearAdding();
    const edge = edgeByChildNode(nodeId, edges)[0];
    if (edge) {
      const parentPieceX = computePiecesPositions(
        nodeById(edge.parentNodeId, nodes).pieces,
        connectorPlaceholder
      )[edge.parentPieceId];
      const parentPos = computeEdgeParentPos(
        edge.parentNodeId,
        edge.parentPieceId,
        parentPieceX,
        nodes,
        connectorPlaceholder
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
    clearAdding();
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
          connectorPlaceholder
        );
        if (dragEdge.originalEdgeId !== null) {
          const originalEdge = edgeById(dragEdge.originalEdgeId, edges);
          if (
            parentPiece &&
            originalEdge.childNodeId !== parentPiece.parentNodeId &&
            (originalEdge.parentNodeId !== parentPiece.parentNodeId ||
              originalEdge.parentPieceId !== parentPiece.parentPieceId)
          ) {
            clearDragEdge();
            setSelectedEdgeRef(null);
            clearEdgeSelection();
            const newEdge = {
              childNodeId: originalEdge.childNodeId,
              parentNodeId: parentPiece.parentNodeId,
              parentPieceId: parentPiece.parentPieceId,
              type: "",
            };
            updateEdge({ edgeId: originalEdge.id, newEdge: newEdge });
            document.body.style.cursor = "grab";
          } else if (!parentPiece) {
            clearDragEdge();
            setSelectedEdgeRef(null);
            removeEdge({ edgeId: originalEdge.id });
            document.body.style.cursor = "move";
          }
        } else {
          if (
            parentPiece &&
            dragEdge.childNodeId !== parentPiece.parentNodeId
          ) {
            const newEdge = {
              childNodeId: dragEdge.childNodeId,
              parentNodeId: parentPiece.parentNodeId,
              parentPieceId: parentPiece.parentPieceId,
              type: "",
            };
            clearDragEdge();
            addEdge({ edge: newEdge });
            document.body.style.cursor = "grab";
          }
        }
      } else {
        const childNodeId = closestChildId(
          (pointerPos.x - stagePos.x) / stageScale.x,
          (pointerPos.y - stagePos.y) / stageScale.y,
          nodes
        );
        if (dragEdge.originalEdgeId !== null) {
          const originalEdge = edgeById(dragEdge.originalEdgeId, edges);
          if (
            childNodeId &&
            childNodeId !== originalEdge.parentNodeId &&
            originalEdge.childNodeId !== childNodeId
          ) {
            clearDragEdge();
            setSelectedEdgeRef(null);
            clearEdgeSelection();
            const newEdge = {
              parentNodeId: originalEdge.parentNodeId,
              parentPieceId: originalEdge.parentPieceId,
              childNodeId: childNodeId,
              type: "",
            };
            updateEdge({ edgeId: dragEdge.originalEdgeId, newEdge: newEdge });
            document.body.style.cursor = "grab";
          } else if (!childNodeId) {
            clearDragEdge();
            setSelectedEdgeRef(null);
            removeEdge({ edgeId: originalEdge.id });
            document.body.style.cursor = "move";
          }
        } else {
          if (childNodeId && dragEdge.parentNodeId !== childNodeId) {
            const newEdge = {
              parentNodeId: dragEdge.parentNodeId,
              parentPieceId: dragEdge.parentPieceId,
              childNodeId: childNodeId,
              type: "",
            };
            clearDragEdge();
            addEdge({ edge: newEdge });
            document.body.style.cursor = "grab";
          }
        }
      }
      clearDragEdge();
      document.body.style.cursor = "move";
    }
  };

  const handleStageClick = e => {
    if (addingNode) {
      const stagePos = stageRef.current.absolutePosition();
      const pointerPos = stageRef.current.getPointerPosition();
      const stageScale = stageRef.current.scale();
      const nodeWidth = computeNodeWidth(addValue, connectorPlaceholder);
      addNode({
        pieces: addValue,
        x: (pointerPos.x - stagePos.x) / stageScale.x,
        y: (pointerPos.y - stagePos.y) / stageScale.y,
        width: nodeWidth,
      });
      clearAdding();
    } else {
      if (selectedNode !== null) {
        clearNodeSelection();
      }
      if (selectedEdge !== null) {
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
      const nodeWidth = computeNodeWidth(addValue, connectorPlaceholder);
      addNode({
        pieces: addValue,
        x: (pointerPos.x - stagePos.x) / stageScale.x,
        y: (pointerPos.y - stagePos.y) / stageScale.y,
        width: nodeWidth,
      });
      clearAdding();
    } else {
      e.currentTarget.moveToTop();
      const selectingNode = nodeById(nodeId, nodes);
      if (selectedEdge !== null) {
        selectedEdgeRef.moveToBottom();
        setSelectedEdgeRef(null);
        clearEdgeSelection();
      }
      if (selectedNode === null) {
        selectNode({ selectedNode: selectingNode });
        document.getElementById("editField").value = selectingNode.pieces.join(
          ""
        );
        editValueChange({ editValue: [] });
      } else {
        if (selectedNode.id !== selectingNode.id) {
          selectNode({ selectedNode: selectingNode });
          document.getElementById(
            "editField"
          ).value = selectingNode.pieces.join("");
          editValueChange({ editValue: [] });
        }
      }
    }
  };

  const handleNodeDblClick = nodeId => {
    if (selectedRootNode !== null && selectedRootNode.id === nodeId) {
      clearRootTypeValue();
      clearRootSelection();
    } else {
      clearRootTypeValue();
      const selectedRootNode = nodeById(nodeId, nodes);
      selectRootNode({ selectedRootNode: selectedRootNode });
    }
  };

  const handleEdgeClick = (e, edgeId) => {
    if (addingNode) {
      const stagePos = stageRef.current.absolutePosition();
      const pointerPos = stageRef.current.getPointerPosition();
      const stageScale = stageRef.current.scale();
      const nodeWidth = computeNodeWidth(addValue, connectorPlaceholder);
      addNode({
        pieces: addValue,
        x: (pointerPos.x - stagePos.x) / stageScale.x,
        y: (pointerPos.y - stagePos.y) / stageScale.y,
        width: nodeWidth,
      });
      clearAdding();
    } else {
      e.cancelBubble = true;
      if (selectedNode !== null) {
        clearNodeSelection();
      }
      if (selectedEdge === null) {
        e.currentTarget.moveToTop();
        const selectingEdge = edgeById(edgeId, edges);
        setSelectedEdgeRef(e.currentTarget);
        selectEdge({ selectedEdge: selectingEdge });
        typeValueChange({ typeValue: selectingEdge.type });
      } else {
        if (selectedEdgeRef !== e.currentTarget) {
          selectedEdgeRef.moveToBottom();
          e.currentTarget.moveToTop();
          const selectingEdge = edgeById(edgeId, edges);
          setSelectedEdgeRef(e.currentTarget);
          selectEdge({ selectedEdge: selectingEdge });
          typeValueChange({ typeValue: selectingEdge.type });
        }
      }
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

    const scaleBy = 1.01;
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

  return (
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
        initialState={initialState}
        edgeTypes={edgeTypes}
        selectedEdgeRef={selectedEdgeRef}
        setSelectedEdgeRef={setSelectedEdgeRef}
      />
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onClick={handleStageClick}
        style={addingNode ? { cursor: "crosshair" } : {}}
        draggable
        onDragStart={e => {
          document.body.style.cursor = "grabbing";
        }}
        onDragMove={e => handleStageDragMove(e)}
        onDragEnd={e => {
          document.body.style.cursor = "move";
        }}
        onWheel={handleStageWheel}
        onMouseOver={e => {
          document.body.style.cursor = "move";
        }}
        onMouseLeave={e => {
          document.body.style.cursor = "default";
        }}
      >
        <Layer
          onMouseOver={e => {
            e.cancelBubble = true;
            document.body.style.cursor = "pointer";
          }}
        >
          {edges.map((edge, i) => (
            <Edge
              key={"Edge-" + edge.id}
              id={edge.id}
              beingDragged={dragEdge && dragEdge.originalEdgeId === edge.id}
              parentPieceX={
                computePiecesPositions(
                  nodeById(edge.parentNodeId, nodes).pieces,
                  connectorPlaceholder
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
              selected={
                selectedEdge !== null ? selectedEdge.id === edge.id : false
              }
              type={edge.type}
              parentNodeId={edge.parentNodeId}
              parentPieceId={edge.parentPieceId}
              childNodeId={edge.childNodeId}
              selectedEdgeRef={selectedEdgeRef}
              setSelectedEdgeRef={setSelectedEdgeRef}
              clearEdgeSelection={clearEdgeSelection}
            />
          ))}
          {nodes.map((node, i) => (
            <Node
              id={node.id}
              key={"Node-" + node.id}
              stageRef={stageRef}
              edges={edges}
              nodes={nodes}
              connectorPlaceholder={connectorPlaceholder}
              x={nodePositionById(node.id, nodes).x}
              y={nodePositionById(node.id, nodes).y}
              nodeWidth={node.width}
              pieces={node.pieces}
              isSelected={
                selectedNode !== null ? selectedNode.id === node.id : false
              }
              isSelectedRoot={
                selectedRootNode !== null
                  ? selectedRootNode.id === node.id
                  : false
              }
              stageWidth={width}
              stageHeight={height}
              moveNodeTo={moveNodeTo}
              moveNodeToEnd={moveNodeToEnd}
              selectNode={selectNode}
              clearNodeSelection={clearNodeSelection}
              clearEdgeSelection={clearEdgeSelection}
              removeNode={removeNode}
              onNodeClick={e => handleNodeClick(e, node.id)}
              onNodeDblClick={() => handleNodeDblClick(node.id)}
              onNodeConnectorDragStart={handleNodeConnectorDragStart}
              onPieceConnectorDragStart={handlePieceConnectorDragStart}
              selectedEdgeRef={selectedEdgeRef}
              setSelectedEdgeRef={setSelectedEdgeRef}
              editValueChange={editValueChange}
              rootTypeValue={rootTypeValue}
            />
          ))}
          {dragEdge && (
            <DragEdge
              key="DragEdge"
              parentX={dragEdge.parentX}
              parentY={dragEdge.parentY}
              childX={dragEdge.childX}
              childY={dragEdge.childY}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

export default ExpressionTreeEditor;
