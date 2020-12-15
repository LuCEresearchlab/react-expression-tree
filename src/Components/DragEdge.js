import React from "react";
import { Line, Circle } from "react-konva";

function DragEdge({
  childX,
  childY,
  parentX,
  parentY,
  fontSize,
  dragEdgeColor,
  dragEdgeChildConnectorColor,
  dragEdgeParentConnectorColor,
}) {
  return (
    // DragEdge is composed of a Line and two Circle ends components
    <>
      <Line
        points={[childX, childY, parentX, parentY]}
        stroke={dragEdgeColor || "black"}
        strokeWidth={fontSize / 4}
        lineCap="round"
        lineJoin="round"
      />
      <Circle
        x={childX}
        y={childY}
        radius={fontSize / 4}
        fill={dragEdgeChildConnectorColor || "#00c0c3"}
        stroke="black"
        strokeWidth={1}
      />
      <Circle
        x={parentX}
        y={parentY}
        radius={fontSize / 4}
        fill={dragEdgeParentConnectorColor || "#c33100"}
        stroke="black"
        strokeWidth={1}
      />
    </>
  );
}

export default DragEdge;
