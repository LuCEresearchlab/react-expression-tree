import React from "react";
import { Circle, Text, Arrow } from "react-konva";
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
      <Circle
        kind="NodeConnector"
        key={"NodeConnector-" + id}
        id={id}
        x={parentX + xPad + parentPieceX + holeWidth / 2}
        y={parentY + yPad + textHeight / 2}
        radius={5}
        fill={beingDragged ? "#f0f0f0" : "black"}
      />
      <Arrow
        key={"Edge-Line-" + id}
        points={[
          parentX + xPad + parentPieceX + holeWidth / 2,
          parentY + yPad + textHeight / 2,
          childX + xPad + childWidth / 2,
          childY,
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
