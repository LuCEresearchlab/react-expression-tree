import React from 'react';
import Node from './Node.js';
import Edge from './Edge.js';
import { 
  Stage, 
  Layer, 
} from "react-konva";

function App() {
  const nodes = [
    [ "19" ],
    [ "age" ],
    [ "\"Hello World!\"" ],
    [ "-", null ],
    [ null, "<", null ],
    [ null, "+", null ],
    [ "(int)", null ],
    [ null, "?", null, ":", null ],
    [ null, ".", "length" ],
    [ null, ".", "length()" ],
    [ null, ".", "append(", null, ")" ],
  ];
  const edges = [
    [[3, 1], 0],
    [[4, 0], 3],
    [[4, 2], 1]
  ];
  const nodePositions = nodes.map((n, i) => ({x: 10, y: 10+i*50}));
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {
          edges.map((edge,i) => (
            <Edge
              key={i}
              parentPieces={nodes[edge[0][0]]}
              parentPieceId={edge[0][1]}
              childPieces={nodes[edge[1]]}
              parentX={nodePositions[edge[0][0]].x}
              parentY={nodePositions[edge[0][0]].y}
              childX={nodePositions[edge[1]].x}
              childY={nodePositions[edge[1]].y}
            />
          ))
        }
        {
          nodes.map((node,i) => (
            <Node
              key={i}
              x={nodePositions[i].x}
              y={nodePositions[i].y}
              pieces={node}
            />
          ))
        }
      </Layer>
    </Stage>
  );
}

export default App;
