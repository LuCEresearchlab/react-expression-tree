import React, { useState } from 'react';
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
    [[4, 2], 1],
    [[7, 0], 4],
    [[7, 2], 9],
    [[9, 0], 2]
  ];
  const initialNodePositions = nodes.map((n, i) => ({x: 10, y: 10+i*50}));
  const [nodePositions, setNodePositions] = useState(initialNodePositions);
  const handleNodeMove = (id, x, y) => {
    setNodePositions(
      nodePositions.map((nodePosition, i) => 
        i===id ? {x: x, y: y} : nodePosition
      )
    )
    nodePositions[id] = {x: x, y: y};
  }
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
              id={i}
              x={nodePositions[i].x}
              y={nodePositions[i].y}
              pieces={node}
              onMove={handleNodeMove}
            />
          ))
        }
      </Layer>
    </Stage>
  );
}

export default App;
