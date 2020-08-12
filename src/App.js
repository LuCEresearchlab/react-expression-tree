import React, { useState } from 'react';
import Node from './Node.js';
import Edge from './Edge.js';
import { 
  Stage, 
  Layer, 
} from "react-konva";
import DragEdge from './DragEdge.js';
import { computeNodeWidth, xPad, yPad, textHeight, computePiecesPositions, holeWidth } from './layout.js';

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
  const initialNodePositions = initialNodes.map((node, i) => ({
    id: node.id,
    x: 10, 
    y: 10 + i * 55,
  }));

  // State
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [nodePositions, setNodePositions] = useState(initialNodePositions);
  const [dragEdge, setDragEdge] = useState(null);

  // Lookup functions
  const nodeById = (nodeId) => nodes.find((node)=>node.id===nodeId);
  const edgeById = (edgeId) => edges.find((edge) => edge.id===edgeId);
  const edgeByChildNode = (childNodeId) => edges.find((edge)=>edge.childNodeId===childNodeId);
  const edgeByParentPiece = (parentNodeId, parentPieceId) => edges.find((edge)=>edge.parentNodeId===parentNodeId && edge.parentPieceId===parentPieceId);
  const nodePositionById = (nodeId) => nodePositions.find((nodePosition)=>nodePosition.id===nodeId);

  // Layout functions
  const computeEdgeChildPos = (childNodeId) => {
    const nodePos = nodePositionById(childNodeId);
    return {
      x: nodePos.x + xPad + computeNodeWidth(nodeById(childNodeId).pieces)/2, 
      y: nodePos.y
    };
  };
  const computeEdgeParentPos = (parentNodeId, parentPieceId) => {
    //TODO
    const nodePos = nodePositionById(parentNodeId);

    return {
      x: nodePos.x + xPad + computePiecesPositions(nodeById(parentNodeId).pieces)[parentPieceId] + holeWidth/2, 
      y: nodePos.y + yPad + textHeight
    };
  };

  // Event handlers
  const handleNodeMove = (id, x, y) => {
    console.log("App.handleNodeMove(", id, x, y, ")");
    setNodePositions(
      nodePositions.map((nodePosition, i) => 
        nodePosition.id===id ? {...nodePosition, x: x, y: y} : nodePosition
      )
    );
  };
  const handleNodeConnectorDragStart = (nodeId, x, y) => {
    console.log("App.handleNodeConnectorDragStart(", nodeId, x, y, ")");
    const edge = edgeByChildNode(nodeId);
    if (edge) {
      console.log("edge found:", edge);
      const parentPos = computeEdgeParentPos(edge.parentNodeId, edge.parentPieceId);
      setDragEdge({
        originalEdgeId: edge.id,
        updateParent: false,
        parentX: parentPos.x,
        parentY: parentPos.y,
        childX: x,
        childY: y,
      });
    } else {
      console.log("no edge found");
      setDragEdge({
        originalEdgeId: undefined,
        updateParent: true,
        parentX: x,
        parentY: y,
        childX: x,
        childY: y,
      });
    }
  };
  const handlePieceConnectorDragStart = (nodeId, pieceId, x, y) => {
    console.log("App.handlePieceConnectorDragStart(", nodeId, pieceId, x, y, ")");
    const edge = edgeByParentPiece(nodeId, pieceId);
    if (edge) {
      console.log("edge found:", edge);
      const childPos = computeEdgeChildPos(edge.childNodeId);
      setDragEdge({
        originalEdgeId: edge.id,
        updateParent: true,
        parentX: x,
        parentY: y,
        childX: childPos.x,
        childY: childPos.y,
      });
    } else {
      setDragEdge({
        originalEdgeId: undefined,
        updateParent: false,
        parentX: x,
        parentY: y,
        childX: x,
        childY: y,
      });
    }
  };
  const handleStageMouseMove = (e) => {
    //console.log("App.handleStageMouseMove(", e, ")");
    if (dragEdge) {
      if (dragEdge.updateParent) {
        setDragEdge({
          ...dragEdge,
          parentX: e.evt.x,
          parentY: e.evt.y,
        });
      } else {
        setDragEdge({
          ...dragEdge,
          childX: e.evt.x,
          childY: e.evt.y,
        });
      }
    }
  };
  const handleStageMouseUp = (e) => {
    console.log("App.handleStageMouseUp(", e, ")");
    if (dragEdge) {
      setDragEdge(null);
    }
  };

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
              id={edge.id}
              beingDragged={dragEdge && dragEdge.originalEdgeId===edge.id}
              parentPieces={nodeById(edge.parentNodeId).pieces}
              parentPieceId={edge.parentPieceId}
              childPieces={nodeById(edge.childNodeId).pieces}
              parentX={nodePositionById(edge.parentNodeId).x}
              parentY={nodePositionById(edge.parentNodeId).y}
              childX={nodePositionById(edge.childNodeId).x}
              childY={nodePositionById(edge.childNodeId).y}
            />
          ))
        }
        {
          nodes.map((node,i) => (
            <Node
              key={"Node-"+node.id}
              id={node.id}
              x={nodePositionById(node.id).x}
              y={nodePositionById(node.id).y}
              pieces={node.pieces}
              onNodeMove={handleNodeMove}
              onNodeConnectorDragStart={handleNodeConnectorDragStart}
              onPieceConnectorDragStart={handlePieceConnectorDragStart}
            />
          ))
        }
        { dragEdge &&
          <DragEdge
            key="DragEdge"
            x1={dragEdge.parentX}
            y1={dragEdge.parentY}
            x2={dragEdge.childX}
            y2={dragEdge.childY}
          />
        }
      </Layer>
    </Stage>
  );
}

export default App;
