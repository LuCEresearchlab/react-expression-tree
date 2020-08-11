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

function Node({pieces, x, y}) {
  const xes = computePiecesPositions(pieces);
  const nodeWidth = computeNodeWidth(pieces);
  return (
    <Group
      x={x}
      y={y}
      draggable
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
