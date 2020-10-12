import React from "react";
import { Line } from "react-konva";

function DragEdge({ childX, childY, parentX, parentY }) {
  return (
    <Line
      points={[parentX, parentY, childX, childY]}
      stroke="black"
      strokeWidth={5}
    />
  );
}

export default DragEdge;
