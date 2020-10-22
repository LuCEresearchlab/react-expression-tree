import React, { useEffect, useRef } from "react";
import Node from "../Node.js";
import Edge from "../Edge.js";
import DragEdge from "../DragEdge.js";
import StageDrawer from "../StageDrawer";
import { Stage, Layer } from "react-konva";
import {
  log,
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
  connectorPlaceholder,
  nodes,
  edges,
  dragEdge,
  removeNode,
  moveNodeTo,
  setDragEdge,
  moveDragEdgeParentEndTo,
  moveDragEdgeChildEndTo,
  removeEdge,
  addEdge,
  clearDragEdge,
  clearNodeSelection,
  addNode,
  selectNode,
  selectedNode,
  addingNode,
  addValue,
  addValueChange,
  clearAdding,
  selectEdge,
  clearEdgeSelection,
  selectedEdge,
  selectRootNode,
  selectedRootNode,
  clearRootSelection,
}) {
  // Get access to DOM node corresponding to <Stage>
  // because we need to get key events from the DOM
  // (Konva doesn't provide key events).
  const stageRef = useRef();

  // Effects
  useEffect(() => {
    // Request focus, so we can respond to key events
    const stage = stageRef.current;
    log("stage:", stage);
    log("stage.container():", stage.container());
    stage.container().tabIndex = 1;
    stage.container().focus();
    // Register (and later unregister) keydown listener
    const delListener = function (e) {
      log("STAGE keydown event: ", e);
      if (e.key === "Backspace" || e.key === "Delete") {
        if (selectedNode !== null) {
          removeNode({ nodeId: selectedNode.id });
          clearNodeSelection();
        } else if (selectedEdge !== null) {
          removeEdge({ edgeId: selectedEdge.id });
          clearEdgeSelection();
        }
      }
    };
    stage.container().addEventListener("keydown", delListener);
    log("STAGE keydown registered");
    return () => {
      stage.container().removeEventListener("keydown", delListener);
      log("STAGE keydown unregistered");
    };
  }, [
    clearEdgeSelection,
    clearNodeSelection,
    removeEdge,
    removeNode,
    selectedEdge,
    selectedNode,
  ]);

  const handleNodeMove = (id, x, y) => {
    log("ExpressionTreeEditor.handleNodeMove(", id, x, y, ")");
    moveNodeTo({ nodeId: id, x: x, y: y });
  };
  const handleNodeConnectorDragStart = (nodeId, x, y) => {
    log(
      "ExpressionTreeEditor.handleNodeConnectorDragStart(",
      nodeId,
      x,
      y,
      ")"
    );
    const edge = edgeByChildNode(nodeId, edges);
    if (edge) {
      log("edge found:", edge);
      const parentPos = computeEdgeParentPos(
        edge.parentNodeId,
        edge.parentPieceId,
        nodes,
        connectorPlaceholder
      );
      const newDragEdge = {
        originalEdgeId: edge.id,
        updateParent: false,
        parentNodeId: edge.parentNodeId,
        parentPieceId: edge.parentPieceId,
        parentX: parentPos.x,
        parentY: parentPos.y,
        childX: x,
        childY: y,
      };
      setDragEdge({ dragEdge: newDragEdge });
    } else {
      log("no edge found");
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
    log(
      "ExpressionTreeEditor.handlePieceConnectorDragStart(",
      nodeId,
      pieceId,
      x,
      y,
      ")"
    );
    const edge = edgeByParentPiece(nodeId, pieceId, edges);
    if (edge) {
      log("edge found:", edge);
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
      log("no edge found");
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
    //TODO: Provide drop target feedback
    //      (e.g., DragEdge color, Node's connector color)
    if (dragEdge) {
      if (dragEdge.updateParent) {
        moveDragEdgeParentEndTo({ x: e.evt.offsetX, y: e.evt.offsetY });
      } else {
        moveDragEdgeChildEndTo({ x: e.evt.offsetX, y: e.evt.offsetY });
      }
    }
  };
  const handleStageMouseUp = e => {
    log("ExpressionTreeEditor.handleStageMouseUp(", e, ")");
    if (dragEdge) {
      log("  dragEdge: ", dragEdge);
      if (dragEdge.updateParent) {
        log("  updateParent");
        const parentPiece = closestParentPiece(
          e.evt.offsetX,
          e.evt.offsetY,
          nodes,
          connectorPlaceholder
        );
        log("    parentPiece: ", parentPiece);
        if (dragEdge.originalEdgeId !== null) {
          const originalEdge = edgeById(dragEdge.originalEdgeId, edges);
          log("    originalEdge: ", originalEdge);
          removeEdge({ edgeId: dragEdge.originalEdgeId });
          clearEdgeSelection();
          if (
            parentPiece &&
            originalEdge.childNodeId !== parentPiece.parentNodeId
          ) {
            const newEdge = {
              childNodeId: originalEdge.childNodeId,
              parentNodeId: parentPiece.parentNodeId,
              parentPieceId: parentPiece.parentPieceId,
              type: "",
            };
            addEdge({ edge: newEdge });
          }
        } else {
          log("    no original edge");
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
            addEdge({ edge: newEdge });
          }
        }
      } else {
        log("  updateChild");
        const childNodeId = closestChildId(e.evt.offsetX, e.evt.offsetY, nodes);
        log("    childNodeId: ", childNodeId);
        if (dragEdge.originalEdgeId !== null) {
          const originalEdge = edgeById(dragEdge.originalEdgeId, edges);
          log("    originalEdge: ", originalEdge);
          removeEdge({ edgeId: dragEdge.originalEdgeId });
          clearEdgeSelection();
          if (childNodeId && childNodeId !== originalEdge.parentNodeId) {
            const newEdge = {
              parentNodeId: originalEdge.parentNodeId,
              parentPieceId: originalEdge.parentPieceId,
              childNodeId: childNodeId,
              type: "",
            };
            addEdge({ edge: newEdge });
          }
        } else {
          log("    no original edge");
          if (childNodeId && dragEdge.parentNodeId !== childNodeId) {
            const newEdge = {
              parentNodeId: dragEdge.parentNodeId,
              parentPieceId: dragEdge.parentPieceId,
              childNodeId: childNodeId,
              type: "",
            };
            addEdge({ edge: newEdge });
          }
        }
      }
      clearDragEdge();
    }
  };
  const handleStageClick = e => {
    if (addingNode) {
      const nodeWidth = computeNodeWidth(addValue, connectorPlaceholder);
      addNode({
        pieces: addValue,
        x: e.evt.offsetX,
        y: e.evt.offsetY,
        width: nodeWidth,
      });
      clearAdding();
    } else {
      log("ExpressionTreeEditor.handleStageClick(", e, ")");
      clearNodeSelection();
      clearEdgeSelection();
    }
  };

  const handleNodeClick = (e, nodeId) => {
    if (addingNode) {
      const nodeWidth = computeNodeWidth(addValue, connectorPlaceholder);
      addNode({
        pieces: addValue,
        x: e.evt.offsetX,
        y: e.evt.offsetY,
        width: nodeWidth,
      });
      clearAdding();
    } else {
      const selectedNode = nodeById(nodeId, nodes);
      clearEdgeSelection();
      selectNode({ selectedNode: selectedNode });
    }
  };

  const handleNodeDblClick = nodeId => {
    if (selectedRootNode !== null && selectedRootNode.id === nodeId) {
      clearRootSelection();
    } else {
      const selectedRootNode = nodeById(nodeId, nodes);
      selectRootNode({ selectedRootNode: selectedRootNode });
    }
  };

  const handleEdgeClick = (e, edgeId) => {
    e.cancelBubble = true;
    clearNodeSelection();
    const selectedEdge = edgeById(edgeId, edges);
    selectEdge({ selectedEdge: selectedEdge });
  };

  return (
    <>
      <StageDrawer connectorPlaceholder={connectorPlaceholder} />
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onClick={handleStageClick}
        style={addingNode ? { cursor: "crosshair" } : {}}
        // draggable
      >
        <Layer>
          {edges.map((edge, i) => (
            <Edge
              key={"Edge-" + edge.id}
              id={edge.id}
              connectorPlaceholder={connectorPlaceholder}
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
              selected={
                selectedEdge !== null ? selectedEdge.id === edge.id : false
              }
              type={edge.type}
            />
          ))}
          {nodes.map((node, i) => (
            <Node
              connectorPlaceholder={connectorPlaceholder}
              key={"Node-" + node.id}
              id={node.id}
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
              onNodeMove={handleNodeMove}
              onNodeConnectorDragStart={handleNodeConnectorDragStart}
              onPieceConnectorDragStart={handlePieceConnectorDragStart}
              onNodeClick={e => handleNodeClick(e, node.id)}
              onNodeDblClick={() => handleNodeDblClick(node.id)}
              stageWidth={width}
              stageHeight={height}
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
    </>
  );
}

export default ExpressionTreeEditor;
