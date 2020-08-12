import React from 'react';
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
  const handleDragStart = (e) => {
    const id = e.target.id();
    console.log("dragStart", id, e);
  }
  const handleDragMove = (e) => {
    const id = e.target.id();
    console.log("dragMove", id, e);
    const x = e.target.x();
    const y = e.target.y();
    onNodeMove(id, x, y);
  }
  const handleDragEnd = (e) => {
    const id = e.target.id();
    console.log("dragEnd", id, e);
    const x = e.target.x();
    const y = e.target.y();
    onNodeMove(id, x, y);
  }

  const handleNodeConnectorDragStart = (e) => {
    const id = e.target.id();
    const pos = e.target.absolutePosition();
    console.log("handleNodeConnectorDragStart", id, pos.x, pos.y, e);
    // we don't want the connector to be moved
    e.target.stopDrag();
    // but we want to initiate the moving around of the connection
    onNodeConnectorDragStart(id, pos.x, pos.y);
  }

  const handlePieceConnectorDragStart = (e) => {
    const id = e.target.id();
    const pos = e.target.absolutePosition();
    console.log("handlePieceConnectorDragStart", id, pos.x, pos.y, e);
    // we don't want the connector to be moved
    e.target.stopDrag();
    // but we want to initiate the moving around of the connection
    onPieceConnectorDragStart(id, pos.x, pos.y);
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
            [
              <Rect
                kind="HolePiece"
                key={"HolePiece-"+i}
                x={xPad + xes[i]}
                y={yPad}
                width={holeWidth}
                height={textHeight}
                fill="#104010"
                cornerRadius={4}
              />,
              <Circle
                kind="PieceConnector"
                key={"PieceConnector-"+i}
                x={xPad + xes[i] + holeWidth/2}
                y={yPad + textHeight/2}
                radius={6}
                fill="black"
                draggable
                onDragStart={handlePieceConnectorDragStart}
                onDragMove={e=>{}}
                onDragEnd={e=>{}}
              />
            ]
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
