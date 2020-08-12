import React, { useState } from 'react';
import Node from './Node.js';
import Edge from './Edge.js';
import { 
  Stage, 
  Layer, 
} from "react-konva";
import DragEdge from './DragEdge.js';

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
  const initialNodePositions = nodes.map((n, i) => ({x: 10, y: 10+i*55}));
  const [nodePositions, setNodePositions] = useState(initialNodePositions);
  const handleNodeMove = (id, x, y) => {
    console.log("App.handleNodeMove(", id, x, y, ")");
    setNodePositions(
      nodePositions.map((nodePosition, i) => 
        i===id ? {x: x, y: y} : nodePosition
      )
    )
    nodePositions[id] = {x: x, y: y};
  };
  const [dragEdge, setDragEdge] = useState({visible: false, x1: 100, y1: 100, x2: 300, y2: 200});
  const handleNodeConnectorDragStart = (nodeId, x, y) => {
    console.log("App.handleNodeConnectorDragStart(", nodeId, x, y, ")");
    setDragEdge({
      ...dragEdge,
      visible: true,
      x2: x,
      y2: y,
    });
  };
  const handlePieceConnectorDragStart = (nodeId, pieceId, x, y) => {
    console.log("App.handlePieceConnectorDragStart(", nodeId, pieceId, x, y, ")");
    setDragEdge({
      ...dragEdge,
      visible: true,
      x1: x,
      y1: y,
    });
  };
  const handleStageMouseMove = (e) => {
    console.log("App.handleStageMouseMove(", e, ")");
    if (dragEdge.visible) {
      setDragEdge({
        ...dragEdge,
        x1: e.evt.x,
        y1: e.evt.y,
      });
    }
  }
  return (
    <Stage 
      width={window.innerWidth} 
      height={window.innerHeight}
      onMouseMove={handleStageMouseMove}
    >
      <Layer>
        {
          edges.map((edge,i) => (
            <Edge
              key={"Edge-"+i}
              id={i}
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
              key={"Node-"+i}
              id={i}
              x={nodePositions[i].x}
              y={nodePositions[i].y}
              pieces={node}
              onNodeMove={handleNodeMove}
              onNodeConnectorDragStart={handleNodeConnectorDragStart}
              onPieceConnectorDragStart={handlePieceConnectorDragStart}
            />
          ))
        }
        { dragEdge.visible &&
          <DragEdge
            key="DragEdge"
            x1={dragEdge.x1}
            y1={dragEdge.y1}
            x2={dragEdge.x2}
            y2={dragEdge.y2}
          />
        }
      </Layer>
    </Stage>
  );
}

export default App;
