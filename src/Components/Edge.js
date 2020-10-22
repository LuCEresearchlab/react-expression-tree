import React from "react";
import { Line, Text } from "react-konva";
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
  return [
    <Line
      key={"Edge-Line-" + id}
      points={[
        parentX + xPad + parentPieceX + holeWidth / 2,
        parentY + yPad + textHeight / 2,
        childX + xPad + childWidth / 2,
        childY,
      ]}
      stroke={beingDragged ? "#f0f0f0" : selected ? "red" : "black"}
      strokeWidth={5}
      onClick={onEdgeClick}
    />,
    <Text
      key={"Edge-Text-" + id}
      x={childX + xPad + childWidth / 2}
      y={childY - 30}
      fill="red"
      fontFamily={"Arial"}
      fontSize={20}
      text={type}
    />,
  ];
}

export default Edge;
