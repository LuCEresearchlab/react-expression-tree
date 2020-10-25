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
  const handleEdgeWheel = e => {
    var curTarget = e.target;
    while (curTarget.parent !== null) {
      curTarget = curTarget.parent;
    }
    e.target = curTarget;
  };

  return [
    <Line
      key={"Edge-Line-" + id}
      points={[
        parentX + xPad + parentPieceX + holeWidth / 2,
        parentY + yPad + textHeight / 2,
        childX + xPad + childWidth / 2,
        childY,
      ]}
      stroke={beingDragged ? "#f0f0f0" : selected ? "blue" : "black"}
      strokeWidth={5}
      onClick={onEdgeClick}
      onWheel={handleEdgeWheel}
    />,
    <Text
      key={"Edge-Text-" + id}
      x={childX + xPad + childWidth / 2}
      y={childY - 30}
      fill="blue"
      fontFamily={"Arial"}
      fontSize={20}
      text={type}
      onClick={onEdgeClick}
      onWheel={handleEdgeWheel}
    />,
  ];
}

export default Edge;
