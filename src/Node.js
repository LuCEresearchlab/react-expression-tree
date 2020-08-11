import React from 'react';
import { 
  Rect,
  Text,
  Group,
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

function Node({id, pieces, x, y, onMove}) {
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
    onMove(id, x, y);
  }
  const handleDragEnd = (e) => {
    const id = e.target.id();
    console.log("dragEnd", id, e);
    const x = e.target.x();
    const y = e.target.y();
    onMove(id, x, y);
  }
  return (
    <Group
      id={id}
      x={x}
      y={y}
      draggable
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <Rect
        x={0}
        y={0}
        width={2*xPad + nodeWidth}
        height={2*yPad + textHeight}
        fill="#208020"
        cornerRadius={5}
        shadowBlur={2}
      />
      {
        pieces.map((p,i) => (
          p==null
          ?
            <Rect
              key={i}
              x={xPad + xes[i]}
              y={yPad}
              width={holeWidth}
              height={textHeight}
              fill="#104010"
              cornerRadius={4}
            />
          :
            <Text
              key={i}
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
