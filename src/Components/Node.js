import React, { useState, useRef } from "react";
import { Rect, Text, Group, Circle, Star } from "react-konva";
import {
  log,
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

  const nodeHeight = 2 * yPad + textHeight;
  const piecesPos = computePiecesPositions(pieces, connectorPlaceholder);
  const nodePiecesWidths = computePiecesWidths(pieces, connectorPlaceholder);

  const handleDragStart = e => {
    const id = e.target.id();
    setDraggingNode(true);
    log("Node.handleDragStart", id, e);
  };

  // const handleDragMove = e => {
  //   if (draggingNode) {
  //     const id = e.target.id();
  //     log("Node.handleDragMove", id, e);
  //     const x = e.target.x();
  //     const y = e.target.y();
  //     onNodeMove(id, x, y);
  //   }
  // };

  const handleDragEnd = e => {
    if (draggingNode) {
      const id = e.target.id();
      log("Node.handleDragEnd", id, e);
      const x = e.target.x();
      const y = e.target.y();
      onNodeMove(id, x, y);
    }
    setDraggingNode(false);
  };

  const handleNodeConnectorDragStart = e => {
    e.cancelBubble = true; // prevent onDragStart of Group
    const nodeId = e.target.id();
    const pos = e.target.absolutePosition();
    log("Node.handleNodeConnectorDragStart", nodeId, pos.x, pos.y, e);
    // we don't want the connector to be moved
    e.target.stopDrag();
    // but we want to initiate the moving around of the connection
    onNodeConnectorDragStart(nodeId, pos.x, pos.y);
  };

  const handlePieceConnectorDragStart = (e, nodeId) => {
    e.cancelBubble = true; // prevent onDragStart of Group
    const pieceId = e.target.id();
    const pos = e.target.absolutePosition();
    log("Node.handlePieceConnectorDragStart", nodeId, pieceId, pos.x, pos.y, e);
    // we don't want the connector to be moved
    e.target.stopDrag();
    // but we want to initiate the moving around of the connection
    onPieceConnectorDragStart(
      nodeId,
      pieceId,
      pos.x + holeWidth / 2,
      pos.y + textHeight
    );
  };

  const handleNodeClick = e => {
    e.cancelBubble = true;
    onNodeClick(e);
  };

  const checkDragBound = pos => {
    var newX = pos.x;
    var newY = pos.y;
    if (pos.x < 0) {
      newX = 0;
    } else if (pos.x > stageWidth - nodeWidth) {
      newX = stageWidth - nodeWidth;
    }
    if (pos.y < 0) {
      newY = 0;
    } else if (pos.y > stageHeight - nodeHeight) {
      newY = stageHeight - nodeHeight;
    }
    return {
      x: newX,
      y: newY,
    };
  };

  return (
    <Group
      kind="Node"
      key={"Node-" + id}
      id={id}
      x={x}
      y={y}
      draggable
      onDragStart={handleDragStart}
      // onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onClick={handleNodeClick}
      onDblClick={onNodeDblClick}
      dragBoundFunc={pos => checkDragBound(pos)}
    >
      <Rect
        kind="NodeRect"
        key={"NodeRect-" + id}
        x={0}
        y={0}
        width={2 * xPad + nodeWidth}
        height={nodeHeight}
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
        text={"" + id}
      />
      {isSelectedRoot ? (
        <Star
          x={xPad + nodeWidth / 2}
          y={0}
          numPoints={5}
          innerRadius={5}
          outerRadius={10}
          fill="red"
          draggable
          onDragStart={handleNodeConnectorDragStart}
          onDragMove={e => {}}
          onDragEnd={e => {}}
        />
      ) : (
        <Circle
          kind="NodeConnector"
          key={"NodeConnector-" + id}
          id={id}
          x={xPad + nodeWidth / 2}
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
            y={holeWidth}
            width={nodePiecesWidths[i]}
            height={nodePiecesWidths[i] * 1.5}
            fill="#104010"
            stroke="black"
            strokeWidth={1}
            cornerRadius={4}
            draggable
            onDragStart={e => handlePieceConnectorDragStart(e, id)}
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
