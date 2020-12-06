import React from "react";
import { Line, Circle } from "react-konva";

function DragEdge({ childX, childY, parentX, parentY, fontSize }) {
  return (
    <>
      <Line
        points={[childX, childY, parentX, parentY]}
        stroke="black"
        strokeWidth={fontSize / 4}
        lineCap="round"
        lineJoin="round"
      />
      <Circle x={childX} y={childY} radius={fontSize / 4} fill="black" />
      <Circle x={parentX} y={parentY} radius={fontSize / 4} fill="black" />
    </>
  );
}

export default DragEdge;
