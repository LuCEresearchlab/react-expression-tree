import React from 'react';
import { 
  Line,
} from "react-konva";

function DragEdge({x1, y1, x2, y2}) {
  return (
    <Line
      points={[
        x1, y1, x2, y2
      ]}
      stroke='grey'
      strokeWidth={3}
    />
  );
}

export default DragEdge;
