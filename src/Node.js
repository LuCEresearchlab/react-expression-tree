import React, {useState} from 'react';
import { 
  Rect,
  Text,
  Group,
  Circle,
} from "react-konva";
import {
  xPad,
  yPad,
  fontFamily,
  fontSize,
  textHeight,
  holeWidth,
  computePiecesPositions,
  computeNodeWidth,
} from './layout.js';

function Node({id, pieces, x, y, onNodeMove, onNodeConnectorDragStart, onPieceConnectorDragStart}) {
  const xes = computePiecesPositions(pieces);
  const nodeWidth = computeNodeWidth(pieces);

  // keep track
  // to prevent onMoveNode() notifications
  // when we don't drag the node itself but drag from a connector
  const [draggingNode,setDraggingNode] = useState(false);

  const handleDragStart = (e) => {
    const id = e.target.id();
    setDraggingNode(true);
    console.log("Node.handleDragStart", id, e);
  }
  const handleDragMove = (e) => {
    if (draggingNode) {
      const id = e.target.id();
      console.log("Node.handleDragMove", id, e);
      const x = e.target.x();
      const y = e.target.y();
      onNodeMove(id, x, y);
    }
  }
  const handleDragEnd = (e) => {
    if (draggingNode) {
      const id = e.target.id();
      console.log("Node.handleDragEnd", id, e);
      const x = e.target.x();
      const y = e.target.y();
      onNodeMove(id, x, y);
    }
    setDraggingNode(false);
  }

  const handleNodeConnectorDragStart = (e) => {
    const nodeId = e.target.id();
    const pos = e.target.absolutePosition();
    console.log("Node.handleNodeConnectorDragStart", nodeId, pos.x, pos.y, e);
    // we don't want the connector to be moved
    e.target.stopDrag();
    // but we want to initiate the moving around of the connection
    onNodeConnectorDragStart(nodeId, pos.x, pos.y);
  }

  const handlePieceConnectorDragStart = (e, nodeId) => {
    const pieceId = e.target.id();
    const pos = e.target.absolutePosition();
    console.log("Node.handlePieceConnectorDragStart", nodeId, pieceId, pos.x, pos.y, e);
    // we don't want the connector to be moved
    e.target.stopDrag();
    // but we want to initiate the moving around of the connection
    onPieceConnectorDragStart(nodeId, pieceId, pos.x + holeWidth/2, pos.y + textHeight);
  }

  return (
    <Group
      kind="Node"
      key={"Node-"+id}
      id={id}
      x={x}
      y={y}
      draggable
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <Rect
        kind="NodeRect"
        key={"NodeRect-"+id}
        x={0}
        y={0}
        width={2*xPad + nodeWidth}
        height={2*yPad + textHeight}
        fill="#208020"
        cornerRadius={5}
        shadowBlur={0}
      />
      <Circle
        kind="NodeConnector"
        key={"NodeConnector-"+id}
        id={id}
        x={xPad + nodeWidth/2}
        y={0}
        radius={6}
        fill="black"
        draggable
        onDragStart={handleNodeConnectorDragStart}
        onDragMove={e=>{}}
        onDragEnd={e=>{}}
      />
      {
        pieces.map((p,i) => (
          p==null
          ?
            <Rect
              kind="HolePiece"
              key={"HolePiece-"+i}
              id={i}
              x={xPad + xes[i]}
              y={yPad}
              width={holeWidth}
              height={textHeight}
              fill="#104010"
              cornerRadius={4}
              draggable
              onDragStart={e=>handlePieceConnectorDragStart(e, id)}
              onDragMove={e=>{}}
              onDragEnd={e=>{}}
            />
          :
            <Text
              kind="TextPiece"
              key={"TextPiece-"+i}
              x={xPad + xes[i]}
              y={yPad}
              fill="white"
              fontFamily={fontFamily}
              fontSize={fontSize}
              text={p}
            />
        ))
      }
    </Group>
  );
}

export default Node;
