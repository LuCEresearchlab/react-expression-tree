import React from 'react';
import { 
  Rect,
  Text,
  Group,
} from "react-konva";
import Konva from 'konva';

function Node({pieces, row}) {
  const xPad = 10;
  const yPad = 10;
  const gapWidth = 5;
  const fontFamily = "Ubuntu Mono, Courier";
  const fontSize = 24;
  const oText = new Konva.Text({
    text: "o",
    fontFamily: fontFamily,
    fontSize: fontSize
  });
  const textHeight = oText.fontSize();
  const holeWidth = oText.getTextWidth();
  const widths = pieces.map(p => {
    if (p==null) {
      return holeWidth;
    } else {
      const text = new Konva.Text({
        text: p,
        fontFamily: fontFamily,
        fontSize: fontSize,
      });
      return text.getTextWidth();
    }
  });
  let x = 0;
  const xes = widths.map(w => {
    let myX = x;
    x += w + gapWidth;
    return myX;
  });
  x -= gapWidth;
  return (
    <Group
      x={xPad}
      y={yPad + row * (3*yPad + textHeight)}
      draggable
    >
      <Rect
        x={0}
        y={0}
        width={2*xPad + x}
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
