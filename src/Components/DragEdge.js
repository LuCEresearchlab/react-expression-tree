import React from "react";
import { Arrow, Circle } from "react-konva";

function DragEdge({ childX, childY, parentX, parentY }) {
  return (
    <>
      <Circle x={parentX} y={parentY} radius={5} fill="black" />
      <Arrow
        points={[parentX, parentY, childX, childY]}
        stroke="black"
        strokeWidth={5}
        lineCap="round"
        lineJoin="round"
      />
    </>
  );
}

export default DragEdge;
