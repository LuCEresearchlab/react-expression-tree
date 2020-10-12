import React, { useEffect, useRef } from "react";
import Node from "../Node.js";
import Edge from "../Edge.js";
import DragEdge from "../DragEdge.js";
import StageDrawer from "../StageDrawer";
import { Stage, Layer } from "react-konva";
import {
  computeNodeWidth,
  computePiecesPositions,
  xPad,
  yPad,
  textHeight,
  targetRange,
  holeWidth,
} from "../../layout.js";
import { log } from "../../debug.js";

function ExpressionTreeEditor({
  width,
  height,
  nodes,
  edges,
  nodePositions,
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
}) {
  function nodeById(nodeId) {
    if (nodeId === undefined || nodeId === null) {
      throw new Error("Illegal nodeId", nodeId);
    }
    const node = nodes.find(node => node.id === nodeId);
    if (!node) {
      throw new Error("Unknown nodeId", nodeId);
    }
    return node;
  }

  function edgeById(edgeId) {
    if (edgeId === undefined || edgeId === null) {
      throw new Error("Illegal edgeId", edgeId);
    }
    const edge = edges.find(edge => edge.id === edgeId);
    if (!edge) {
      throw new Error("Unknown edgeId", edgeId);
    }
    return edge;
  }

  //TODO: what if we have multiple edges to a child node?
  function edgeByChildNode(childNodeId) {
    return edges.find(edge => edge.childNodeId === childNodeId);
  }

  //TODO: what if we have multiple edges from a parent piece?
  function edgeByParentPiece(parentNodeId, parentPieceId) {
    return edges.find(
      edge =>
        edge.parentNodeId === parentNodeId &&
        edge.parentPieceId === parentPieceId
    );
  }

  function nodePositionById(nodeId) {
    return nodePositions.find(nodePosition => nodePosition.id === nodeId);
  }

  // Layout functions
  const computeEdgeChildPos = childNodeId => {
    const nodePos = nodePositionById(childNodeId);
    return {
      x: nodePos.x + xPad + computeNodeWidth(nodeById(childNodeId).pieces) / 2,
      y: nodePos.y,
    };
  };
  const computeEdgeParentPos = (parentNodeId, parentPieceId) => {
    const nodePos = nodePositionById(parentNodeId);
    return {
      x:
        nodePos.x +
        xPad +
        computePiecesPositions(nodeById(parentNodeId).pieces)[parentPieceId] +
        holeWidth / 2,
      y: nodePos.y + yPad + textHeight,
    };
  };
  const distance = (x1, y1, x2, y2) => {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  };
  const closestChildId = (x, y) => {
    let closestNodeId = null;
    let closestDist = null;
    nodes.forEach(node => {
      const pos = computeEdgeChildPos(node.id);
      const dist = distance(pos.x, pos.y, x, y);
      if (dist < targetRange && (!closestDist || dist < closestDist)) {
        closestDist = dist;
        closestNodeId = node.id;
      }
    });
    return closestNodeId;
  };
  const closestParentPiece = (x, y) => {
    let closestPiece = null;
    let closestDist = null;
    nodes.forEach(node => {
      nodeById(node.id).pieces.forEach((piece, i) => {
        if (piece === null) {
          // only look for holes (represented by null)
          const pos = computeEdgeParentPos(node.id, i);
          const dist = distance(pos.x, pos.y, x, y);
          if (dist < targetRange && (!closestDist || dist < closestDist)) {
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
        } else if (selectedEdge !== null) {
          removeEdge({ edgeId: selectedEdge.id });
        }
      }
    };
    stage.container().addEventListener("keydown", delListener);
    log("STAGE keydown registered");
    return () => {
      stage.container().removeEventListener("keydown", delListener);
      log("STAGE keydown unregistered");
    };
  }, [removeEdge, removeNode, selectedEdge, selectedNode]);

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
    const edge = edgeByChildNode(nodeId);
    if (edge) {
      log("edge found:", edge);
      const parentPos = computeEdgeParentPos(
        edge.parentNodeId,
        edge.parentPieceId
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
    const edge = edgeByParentPiece(nodeId, pieceId);
    if (edge) {
      log("edge found:", edge);
      const childPos = computeEdgeChildPos(edge.childNodeId);
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
    //console.log("ExpressionTreeEditor.handleStageMouseMove(", e, ")");
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
        const parentPiece = closestParentPiece(e.evt.offsetX, e.evt.offsetY);
        log("    parentPiece: ", parentPiece);
        if (dragEdge.originalEdgeId !== null) {
          const originalEdge = edgeById(dragEdge.originalEdgeId);
          log("    originalEdge: ", originalEdge);
          removeEdge({ edgeId: dragEdge.originalEdgeId });
          if (
            parentPiece &&
            originalEdge.childNodeId !== parentPiece.parentNodeId
          ) {
            const newEdge = {
              childNodeId: originalEdge.childNodeId,
              parentNodeId: parentPiece.parentNodeId,
              parentPieceId: parentPiece.parentPieceId,
            };
            addEdge({ edge: newEdge });
          }
        } else {
          log("    no original edge");
          if (
            parentPiece &&
            dragEdge.childNodeId !== parentPiece.parentNodeId
          ) {
            // Note: if we do this we somehow get the wrong childNodeId
            // (Is the dragEdge.childY set wrong? Why?)
            //const childNodeId = closestChildId(dragEdge.childX, dragEdge.childY);
            //console.log("    childNodeId: ", childNodeId);
            const newEdge = {
              childNodeId: dragEdge.childNodeId,
              parentNodeId: parentPiece.parentNodeId,
              parentPieceId: parentPiece.parentPieceId,
            };
            addEdge({ edge: newEdge });
          }
        }
      } else {
        log("  updateChild");
        const childNodeId = closestChildId(e.evt.offsetX, e.evt.offsetY);
        log("    childNodeId: ", childNodeId);
        if (dragEdge.originalEdgeId !== null) {
          const originalEdge = edgeById(dragEdge.originalEdgeId);
          log("    originalEdge: ", originalEdge);
          removeEdge({ edgeId: dragEdge.originalEdgeId });
          if (childNodeId && childNodeId !== originalEdge.parentNodeId) {
            const newEdge = {
              parentNodeId: originalEdge.parentNodeId,
              parentPieceId: originalEdge.parentPieceId,
              childNodeId: childNodeId,
            };
            addEdge({ edge: newEdge });
          }
        } else {
          log("    no original edge");
          if (childNodeId && dragEdge.parentNodeId !== childNodeId) {
            // Note: if we do this we somehow get the wrong parentPieceId
            // (Is the dragEdge.parentX set wrong? Why?)
            //const parentPiece = closestParentPiece(dragEdge.parentX, dragEdge.parentY);
            const newEdge = {
              parentNodeId: dragEdge.parentNodeId,
              parentPieceId: dragEdge.parentPieceId,
              childNodeId: childNodeId,
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
      const pieces = JSON.parse(addValue);
      addNode({
        pieces,
        x: e.evt.offsetX,
        y: e.evt.offsetY,
      });
      clearAdding();
    } else {
      log("ExpressionTreeEditor.handleStageClick(", e, ")");
      clearNodeSelection();
      clearEdgeSelection();
    }
  };
  // const handleStageDblClick = e => {
  //   log("ExpressionTreeEditor.handleStageDblClick(", e, ")");
  //   const piecesString = prompt(
  //     "CREATE NEW AST NODE. Describe the node's pieces as a JSON array. Holes are null, other pieces are strings.",
  //     '["Math.max(", null, ",", null, ")"]'
  //   );
  //   log("piecesString:", piecesString);
  //   const pieces = JSON.parse(piecesString);
  //   addNode({
  //     pieces,
  //     x: e.evt.x,
  //     y: e.evt.y,
  //   });
  // };
  const handleNodeClick = (e, nodeId) => {
    if (addingNode) {
      const pieces = JSON.parse(addValue);
      addNode({
        pieces,
        x: e.evt.offsetX,
        y: e.evt.offsetY,
      });
      clearAdding();
    } else {
      const selectedNode = nodeById(nodeId);
      clearEdgeSelection();
      selectNode({ nodeId: nodeId, selectedNode: selectedNode });
    }
  };

  const handleEdgeClick = (e, edgeId) => {
    e.cancelBubble = true;
    clearNodeSelection();
    const selectedEdge = edgeById(edgeId);
    selectEdge({ edgeId: edgeId, selectedEdge: selectedEdge });
  };

  // const handleStageDrag = e => {
  //   // e.cancelBubble = true;
  //   console.log(e.target.attrs);
  //   console.log(stageRef.current.attrs);
  //   stageRef.current.x(e.target.attrs.x);
  //   stageRef.current.y(e.target.attrs.y);
  // };

  return (
    <>
      <StageDrawer />
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onClick={handleStageClick}
        style={addingNode ? { cursor: "crosshair" } : {}}
        // onDblClick={handleStageDblClick}
        // draggable
        // onDragMove={e => handleStageDrag(e)}
      >
        <Layer>
          {edges.map((edge, i) => (
            <Edge
              key={"Edge-" + edge.id}
              id={edge.id}
              beingDragged={dragEdge && dragEdge.originalEdgeId === edge.id}
              parentPieces={nodeById(edge.parentNodeId).pieces}
              parentPieceId={edge.parentPieceId}
              childPieces={nodeById(edge.childNodeId).pieces}
              parentX={nodePositionById(edge.parentNodeId).x}
              parentY={nodePositionById(edge.parentNodeId).y}
              childX={nodePositionById(edge.childNodeId).x}
              childY={nodePositionById(edge.childNodeId).y}
              onEdgeClick={e => handleEdgeClick(e, edge.id)}
              selected={
                selectedEdge !== null ? selectedEdge.id === edge.id : false
              }
            />
          ))}
          {nodes.map((node, i) => (
            <Node
              key={"Node-" + node.id}
              id={node.id}
              x={nodePositionById(node.id).x}
              y={nodePositionById(node.id).y}
              pieces={node.pieces}
              selected={
                selectedNode !== null ? selectedNode.id === node.id : false
              }
              onNodeMove={handleNodeMove}
              onNodeConnectorDragStart={handleNodeConnectorDragStart}
              onPieceConnectorDragStart={handlePieceConnectorDragStart}
              onNodeClick={e => handleNodeClick(e, node.id)}
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
