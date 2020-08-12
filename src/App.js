import React, { useState } from 'react';
import Node from './Node.js';
import Edge from './Edge.js';
import { 
  Stage, 
  Layer, 
} from "react-konva";
import DragEdge from './DragEdge.js';

function App() {
  // Initial state
  const initialNodes = [
    { id: 0, pieces: [ "19" ] },
    { id: 1, pieces: [ "age" ] },
    { id: 2, pieces: [ "\"Hello World!\"" ] },
    { id: 3, pieces: [ "-", null ] },
    { id: 4, pieces: [ null, "<", null ] },
    { id: 5, pieces: [ null, "+", null ] },
    { id: 6, pieces: [ "(int)", null ] },
    { id: 7, pieces: [ null, "?", null, ":", null ] },
    { id: 8, pieces: [ null, ".", "length" ] },
    { id: 9, pieces: [ null, ".", "length()" ] },
    { id: 10, pieces: [ null, ".", "append(", null, ")" ] },
  ];
  const initialEdges = [
    { id: 0, parentNodeId: 3, parentPieceId: 1, childNodeId: 0 },
    { id: 1, parentNodeId: 4, parentPieceId: 0, childNodeId: 3 },
    { id: 2, parentNodeId: 4, parentPieceId: 2, childNodeId: 1 },
    { id: 3, parentNodeId: 7, parentPieceId: 0, childNodeId: 4 },
    { id: 4, parentNodeId: 7, parentPieceId: 2, childNodeId: 9 },
    { id: 5, parentNodeId: 9, parentPieceId: 0, childNodeId: 2 },
  ];
  const initialNodePositions = initialNodes.map((n, i) => ({x: 10, y: 10+i*55}));

  // State
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [nodePositions, setNodePositions] = useState(initialNodePositions);
  const [dragEdge, setDragEdge] = useState({visible: false, x1: 100, y1: 100, x2: 300, y2: 200});

  // Lookup functions
  const nodeById = (nodeId) => nodes.find((node)=>node.id===nodeId);
  const edgeById = (edgeId) => edges.find((edge) => edge.id===edgeId);
  const edgeByChildNode = (childNodeId) => edges.find((edge)=>edge.childNodeId===childNodeId);
  const edgeByParentPiece = (parentNodeId, parentPieceId) => edges.find((edge)=>edge.parentNodeId===parentNodeId && edge.parentPieceId===parentPieceId);

  // Event handlers
  const handleNodeMove = (id, x, y) => {
    console.log("App.handleNodeMove(", id, x, y, ")");
    setNodePositions(
      nodePositions.map((nodePosition, i) => 
        i===id ? {x: x, y: y} : nodePosition
      )
    )
    nodePositions[id] = {x: x, y: y};
  };
  const handleNodeConnectorDragStart = (nodeId, x, y) => {
    console.log("App.handleNodeConnectorDragStart(", nodeId, x, y, ")");
    const edge = edgeByChildNode(nodeId);
    if (edge) {
      console.log("edge found:", edge);
      // TODO
    }
    setDragEdge({
      ...dragEdge,
      visible: true,
      x1: x,
      y1: y,
      x2: x,
      y2: y,
    });
  };
  const handlePieceConnectorDragStart = (nodeId, pieceId, x, y) => {
    console.log("App.handlePieceConnectorDragStart(", nodeId, pieceId, x, y, ")");
    const edge = edgeByParentPiece(nodeId, pieceId);
    if (edge) {
      console.log("edge found:", edge);
      // TODO
    }
    setDragEdge({
      ...dragEdge,
      visible: true,
      x1: x,
      y1: y,
      x2: x,
      y2: y,
    });
  };
  const handleStageMouseMove = (e) => {
    //console.log("App.handleStageMouseMove(", e, ")");
    if (dragEdge.visible) {
      setDragEdge({
        ...dragEdge,
        x1: e.evt.x,
        y1: e.evt.y,
      });
    }
  }
  const handleStageMouseUp = (e) => {
    console.log("App.handleStageMouseUp(", e, ")");
    if (dragEdge.visible) {
      setDragEdge({
        ...dragEdge,
        visible: false,
      });
    }
  }

  return (
    <Stage 
      width={window.innerWidth} 
      height={window.innerHeight}
      onMouseMove={handleStageMouseMove}
      onMouseUp={handleStageMouseUp}
    >
      <Layer>
        {
          edges.map((edge,i) => (
            <Edge
              key={"Edge-"+edge.id}
              id={edge.i}
              parentPieces={nodeById(edge.parentNodeId).pieces}
              parentPieceId={edge.parentPieceId}
              childPieces={nodeById(edge.childNodeId).pieces}
              parentX={nodePositions[edge.parentNodeId].x}
              parentY={nodePositions[edge.parentNodeId].y}
              childX={nodePositions[edge.childNodeId].x}
              childY={nodePositions[edge.childNodeId].y}
            />
          ))
        }
        {
          nodes.map((node,i) => (
            <Node
              key={"Node-"+node.id}
              id={node.id}
              x={nodePositions[node.id].x}
              y={nodePositions[node.id].y}
              pieces={node.pieces}
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
