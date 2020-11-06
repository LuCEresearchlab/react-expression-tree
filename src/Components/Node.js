import React, { useState, useRef } from "react";
import { Rect, Text, Group, Circle, Star } from "react-konva";
import {
  xPad,
  yPad,
  fontFamily,
  defaultFontSize,
  textHeight,
  holeWidth,
  computePiecesWidths,
  computePiecesPositions,
  edgeByParentPiece,
  nodeById,
} from "../utils.js";

function Node({
  connectorPlaceholder,
  id,
  pieces,
  x,
  y,
  isSelected,
  moveNodeTo,
  moveNodeToEnd,
  selectNode,
  removeNode,
  clearEdgeSelection,
  onNodeConnectorDragStart,
  onPieceConnectorDragStart,
  onNodeClick,
  onNodeDblClick,
  stageWidth,
  stageHeight,
  isSelectedRoot,
  nodeWidth,
  stageRef,
  edges,
  nodes,
  selectedEdgeRef,
  setSelectedEdgeRef,
  editValueChange,
}) {
  const nodeRef = useRef();

  // keep track
  // to prevent onMoveNode() notifications
  // when we don't drag the node itself but drag from a connector
  const [draggingNode, setDraggingNode] = useState(false);

  const nodePadHeight = 2 * yPad + textHeight;
  const nodePadWidth = 2 * xPad + nodeWidth;
  const piecesPos = computePiecesPositions(pieces, connectorPlaceholder);
  const nodePiecesWidths = computePiecesWidths(pieces, connectorPlaceholder);

  const handleDragStart = e => {
    e.currentTarget.moveToTop();
    setDraggingNode(true);
    const selectingNode = nodeById(id, nodes);
    selectNode({ selectedNode: selectingNode });
    document.getElementById("editField").value = selectingNode.pieces.join("");
    editValueChange({ editValue: [] });
    if (selectedEdgeRef !== null) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
      clearEdgeSelection();
    }
  };

  const handleDragMove = e => {
    e.cancelBubble = true;
    if (draggingNode) {
      const id = e.target.id();
      const x = e.target.x();
      const y = e.target.y();
      moveNodeTo({ nodeId: id, x: x, y: y });
    }
  };

  const handleDragEnd = e => {
    e.cancelBubble = true;
    if (draggingNode) {
      const id = e.target.id();
      const x = e.target.x();
      const y = e.target.y();
      moveNodeToEnd({ nodeId: id, x: x, y: y });
    }
    document.body.style.cursor = "pointer";
    setDraggingNode(false);
  };

  const handleNodeClick = e => {
    e.cancelBubble = true;
    onNodeClick(e);
  };

  const handleNodeConnectorDragStart = e => {
    e.cancelBubble = true; // prevent onDragStart of Group
    if (selectedEdgeRef !== null) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
      clearEdgeSelection();
    }
    document.body.style.cursor = "grabbing";
    const nodeId = e.target.id();
    // we don't want the connector to be moved
    e.target.stopDrag();
    // but we want to initiate the moving around of the connection
    onNodeConnectorDragStart(
      nodeId,
      e.target.parent.x() + e.target.x(),
      e.target.parent.y() + e.target.y()
    );
  };

  const handlePieceConnectorDragStart = (e, nodeId) => {
    e.cancelBubble = true; // prevent onDragStart of Group
    if (selectedEdgeRef !== null) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
      clearEdgeSelection();
    }
    document.body.style.cursor = "grabbing";
    const pieceId = e.target.id();
    // const pos = e.target.absolutePosition();
    // we don't want the connector to be moved
    e.target.stopDrag();
    // but we want to initiate the moving around of the connection
    onPieceConnectorDragStart(
      nodeId,
      pieceId,
      e.target.parent.parent.x() +
        e.target.parent.x() +
        e.target.x() +
        holeWidth / 2,
      e.target.parent.parent.y() +
        e.target.parent.y() +
        e.target.y() +
        holeWidth * 0.75
    );
  };

  const checkDragBound = pos => {
    const stageScale = stageRef.current.scale();
    var newX = pos.x;
    var newY = pos.y;
    if (pos.x < 0) {
      newX = 0;
    } else if (pos.x > stageWidth - nodePadWidth * stageScale.x) {
      newX = stageWidth - nodePadWidth * stageScale.x;
    }
    if (pos.y < 0) {
      newY = 0;
    } else if (pos.y > stageHeight - nodePadHeight * stageScale.y) {
      newY = stageHeight - nodePadHeight * stageScale.y;
    }
    return {
      x: newX,
      y: newY,
    };
  };

  const handleRemoveClick = e => {
    if (selectedEdgeRef !== null) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
      clearEdgeSelection();
    }
    removeNode({ nodeId: e.target.parent.attrs.id });
  };

  return (
    <Group
      kind="Node"
      key={"Node-" + id}
      id={id}
      x={x}
      y={y}
      draggable
      onClick={handleNodeClick}
      onDblClick={onNodeDblClick}
      onDragStart={e => handleDragStart(e)}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      dragBoundFunc={pos => checkDragBound(pos)}
    >
      <Rect
        kind="NodeRect"
        key={"NodeRect-" + id}
        x={0}
        y={0}
        width={nodePadWidth}
        height={nodePadHeight}
        fill={isSelected ? "#3f50b5" : "#208020"}
        stroke="black"
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={5}
        shadowEnabled={isSelected}
        shadowColor="black"
        shadowOffset={{ x: 3, y: 3 }}
        shadowBlur={3}
        ref={nodeRef}
      />
      <Text
        x={3}
        y={3}
        fill="white"
        fontFamily={fontFamily}
        fontSize={defaultFontSize * 0.4}
        text={id}
      />
      {isSelectedRoot ? (
        <Star
          id={id}
          x={nodePadWidth / 2}
          y={0}
          numPoints={5}
          innerRadius={5}
          outerRadius={10}
          fill="#3f50b5"
          stroke="black"
          strokeWidth={2}
          draggable
          onDragStart={handleNodeConnectorDragStart}
          onDragMove={() => {}}
          onDragEnd={() => {}}
          onMouseOver={e => {
            e.cancelBubble = true;
            document.body.style.cursor = "grab";
          }}
        />
      ) : (
        <Circle
          kind="NodeConnector"
          key={"NodeConnector-" + id}
          id={id}
          x={nodePadWidth / 2}
          y={0}
          radius={6}
          fill="black"
          draggable
          onDragStart={handleNodeConnectorDragStart}
          onDragMove={e => {}}
          onDragEnd={e => {}}
          onMouseOver={e => {
            e.cancelBubble = true;
            document.body.style.cursor = "grab";
          }}
        />
      )}
      {pieces.map((p, i) =>
        p === connectorPlaceholder ? (
          <Group key={"HolePiece-" + i}>
            <Rect
              id={i}
              x={xPad + piecesPos[i]}
              y={nodePadHeight / 2 - yPad}
              width={nodePiecesWidths[i]}
              height={nodePiecesWidths[i] * 1.5}
              fill="#104010"
              stroke="black"
              strokeWidth={1}
              cornerRadius={3}
              draggable
              onDragStart={e => handlePieceConnectorDragStart(e, id)}
              onDragMove={e => {}}
              onDragEnd={e => {}}
              onMouseOver={e => {
                e.cancelBubble = true;
                document.body.style.cursor = "grab";
              }}
            />
            <Circle
              id={i}
              x={xPad + piecesPos[i] + holeWidth / 2}
              y={yPad + textHeight / 2}
              draggable
              onDragStart={e => handlePieceConnectorDragStart(e, id)}
              onDragMove={e => {}}
              onDragEnd={e => {}}
              radius={5}
              fill="black"
              onMouseOver={e => {
                e.cancelBubble = true;
                document.body.style.cursor = "grab";
              }}
              visible={edgeByParentPiece(id, i, edges).length > 0}
            />
          </Group>
        ) : (
          <Text
            kind="TextPiece"
            key={"TextPiece-" + i}
            x={xPad + piecesPos[i]}
            y={yPad}
            fill="white"
            fontFamily={fontFamily}
            fontSize={defaultFontSize}
            text={p}
          />
        )
      )}
      <Text
        x={nodePadWidth - 10}
        y={3}
        fill="white"
        fontFamily={fontFamily}
        fontSize={defaultFontSize * 0.4}
        text="X"
        onClick={e => handleRemoveClick(e)}
        onMouseOver={e => {
          e.cancelBubble = true;
          e.target.fill("red");
          e.target.draw();
        }}
        onMouseLeave={e => {
          e.cancelBubble = true;
          e.target.attrs.fill = "white";
          e.target.draw();
        }}
      />
    </Group>
  );
}

export default Node;
