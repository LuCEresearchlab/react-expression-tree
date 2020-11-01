import React from "react";
import { Text, Line } from "react-konva";
import { xPad, yPad, holeWidth, textHeight } from "../utils.js";

function Edge({
  id,
  childWidth,
  parentPieceX,
  parentX,
  parentY,
  childX,
  childY,
  beingDragged,
  onEdgeClick,
  selected,
  type,
}) {
  return (
    <>
      <Line
        key={"Edge-Line-" + id}
        points={[
          childX + xPad + childWidth / 2,
          childY,
          parentX + xPad + parentPieceX + holeWidth / 2,
          parentY + yPad + textHeight / 2,
        ]}
        stroke={beingDragged ? "#f0f0f0" : selected ? "#3f50b5" : "black"}
        strokeWidth={5}
        onClick={onEdgeClick}
        lineCap="round"
        lineJoin="round"
        hitStrokeWidth={10}
      />
      <Text
        key={"Edge-Text-" + id}
        x={childX + xPad + childWidth / 2}
        y={childY - 30}
        fill="#3f50b5"
        fontFamily={"Arial"}
        fontSize={20}
        text={type}
        onClick={onEdgeClick}
      />
    </>
  );
}

export default Edge;
