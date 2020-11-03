import React from "react";
import { Line, Circle } from "react-konva";

function DragEdge({ childX, childY, parentX, parentY }) {
  return (
    <>
      <Line
        points={[childX, childY, parentX, parentY]}
        stroke="black"
        strokeWidth={5}
        lineCap="round"
        lineJoin="round"
      />
      <Circle x={childX} y={childY} radius={6} fill="black" />
      <Circle x={parentX} y={parentY} radius={5} fill="black" />
    </>
  );
}

export default DragEdge;
