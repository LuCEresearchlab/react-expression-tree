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
} from "../utils.js";

function Node({
  connectorPlaceholder,
  id,
  pieces,
  x,
  y,
  isSelected,
  onNodeMove,
  onNodeMoveEnd,
  onNodeConnectorDragStart,
  onPieceConnectorDragStart,
  onNodeClick,
  onNodeDblClick,
  stageWidth,
  stageHeight,
  isSelectedRoot,
  nodeWidth,
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

  const handleDragMove = e => {
    e.cancelBubble = true;
    if (draggingNode) {
      const id = e.target.id();
      const x = e.target.x();
      const y = e.target.y();
      onNodeMove(id, x, y);
    }
  };

  const handleDragEnd = e => {
    if (draggingNode) {
      const id = e.target.id();
      const x = e.target.x();
      const y = e.target.y();
      onNodeMoveEnd(id, x, y);
    }
    setDraggingNode(false);
  };

  const handleNodeClick = e => {
    e.cancelBubble = true;
    onNodeClick(e);
  };

  const handleNodeConnectorDragStart = e => {
    e.cancelBubble = true; // prevent onDragStart of Group
    const nodeId = e.target.id();
    // const pos = e.target.absolutePosition();
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
    const pieceId = e.target.id();
    // const pos = e.target.absolutePosition();
    // we don't want the connector to be moved
    e.target.stopDrag();
    // but we want to initiate the moving around of the connection
    onPieceConnectorDragStart(
      nodeId,
      pieceId,
      e.target.parent.x() + e.target.x() + holeWidth / 2,
      e.target.parent.y() + e.target.y() + holeWidth * 0.75
    );
  };

  const checkDragBound = pos => {
    var newX = pos.x;
    var newY = pos.y;
    if (pos.x < 0) {
      newX = 0;
    } else if (pos.x > stageWidth - nodePadWidth) {
      newX = stageWidth - nodePadWidth;
    }
    if (pos.y < 0) {
      newY = 0;
    } else if (pos.y > stageHeight - nodePadHeight) {
      newY = stageHeight - nodePadHeight;
    }
    return {
      x: newX,
      y: newY,
    };
  };

  const handleNodeWheel = e => {
    var curTarget = e.target;
    while (curTarget.parent !== null) {
      curTarget = curTarget.parent;
    }
    e.target = curTarget;
  };

  return (
    <Group
      kind="Node"
      key={"Node-" + id}
      id={id}
      x={x}
      y={y}
      draggable
      onDragStart={() => setDraggingNode(true)}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onClick={handleNodeClick}
      onDblClick={onNodeDblClick}
      dragBoundFunc={pos => checkDragBound(pos)}
      onWheel={handleNodeWheel}
    >
      <Rect
        kind="NodeRect"
        key={"NodeRect-" + id}
        x={0}
        y={0}
        width={nodePadWidth}
        height={nodePadHeight}
        fill="#208020"
        stroke="black"
        strokeWidth={1}
        strokeScaleEnabled={false}
        cornerRadius={5}
        shadowBlur={isSelected ? 4 : 0}
        ref={nodeRef}
      />
      <Text
        x={3}
        y={3}
        fill="white"
        fontFamily={"Arial"}
        fontSize={defaultFontSize * 0.5}
        text={id}
      />
      {isSelectedRoot ? (
        <Star
          x={nodePadWidth / 2}
          y={0}
          numPoints={5}
          innerRadius={5}
          outerRadius={10}
          fill="blue"
          draggable
          onDragStart={handleNodeConnectorDragStart}
          onDragMove={() => {}}
          onDragEnd={() => {}}
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
        />
      )}
      {pieces.map((p, i) =>
        p === connectorPlaceholder ? (
          <Rect
            kind="HolePiece"
            key={"HolePiece-" + i}
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
          />
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
    </Group>
  );
}

export default Node;
