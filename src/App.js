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
  
  /*
  const initialNodes = [
    { id: 2, pieces: [ "m(", null, ",", null, ")" ] },
    { id: 1, pieces: [ "age" ] },
    { id: 5, pieces: [ "19" ] },
  ];
  const initialEdges = [
  ];
  */
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

  //console.log("State:", nodes, edges, nodePositions, dragEdge);

  // Lookup functions
  const nodeById = (nodeId) => {
    if (nodeId===undefined || nodeId===null) {
      console.error("nodeById(): Illegal nodeId", nodeId);
    }
    const node = nodes.find((node)=>node.id===nodeId);
    if (!node) {
      console.error("nodeById(): Unknown nodeId", nodeId);
    }
    return node;
  };
  const edgeById = (edgeId) => edges.find((edge) => edge.id===edgeId);
  const edgeByChildNode = (childNodeId) => edges.find((edge)=>edge.childNodeId===childNodeId);
  const edgeByParentPiece = (parentNodeId, parentPieceId) => edges.find((edge)=>edge.parentNodeId===parentNodeId && edge.parentPieceId===parentPieceId);
  const nodePositionById = (nodeId) => nodePositions.find((nodePosition)=>nodePosition.id===nodeId);

  // Update functions
  const removeEdge = (edges, edgeId) => {
    console.log("removeEdge(", edges, edgeId, ")");
    return edges.filter(edge => edge.id!==edgeId);
  }
  const addEdge = (edges, edge) => {
    console.log("addEdge(", edges, edge, ")");
    const maxId = edges.map(e=>e.id).reduce((id1, id2) => Math.max(id1, id2), 0);
    return [...edges, {...edge, id: maxId + 1}];
  }

  // Layout functions
  const computeEdgeChildPos = (childNodeId) => {
    const nodePos = nodePositionById(childNodeId);
    return {
      x: nodePos.x + xPad + computeNodeWidth(nodeById(childNodeId).pieces)/2, 
      y: nodePos.y
    };
  };
  const computeEdgeParentPos = (parentNodeId, parentPieceId) => {
    const nodePos = nodePositionById(parentNodeId);
    return {
      x: nodePos.x + xPad + computePiecesPositions(nodeById(parentNodeId).pieces)[parentPieceId] + holeWidth/2, 
      y: nodePos.y + yPad + textHeight
    };
  };
  const targetRange = textHeight;
  const distance = (x1, y1, x2, y2) => {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
  }
  const closestChildId = (x, y) => {
    let closestNodeId = undefined;
    let closestDist = undefined;
    nodes.forEach(node => {
      const pos = computeEdgeChildPos(node.id);
      const dist = distance(pos.x, pos.y, x, y);
      if (dist < targetRange && (!closestDist || dist<closestDist)) {
        closestDist = dist;
        closestNodeId = node.id;
      }
    });
    return closestNodeId;
  };
  const closestParentPiece = (x, y) => {
    let closestPiece = undefined;
    let closestDist = undefined;
    nodes.forEach(node => {
      nodeById(node.id).pieces.forEach((piece, i) => {
        if (piece===null) {
          // only look for holes (represented by null)
          const pos = computeEdgeParentPos(node.id, i);
          const dist = distance(pos.x, pos.y, x, y);
          if (dist < targetRange && (!closestDist || dist<closestDist)) {
            closestDist = dist;
            closestPiece = {
              parentNodeId: node.id,
              parentPieceId: i
            };
          }
        }
      });
    });
    return closestPiece;
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
        parentNodeId: edge.parentNodeId,
        parentPieceId: edge.parentPieceId,
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
        childNodeId: nodeId,
        childX: x,
        childY: y,
        parentX: x,
        parentY: y,
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
        childNodeId: edge.childNodeId,
        childX: childPos.x,
        childY: childPos.y,
        parentX: x,
        parentY: y,
      });
    } else {
      console.log("no edge found");
      setDragEdge({
        originalEdgeId: undefined,
        updateParent: false,
        parentNodeId: nodeId,
        parentPieceId: pieceId,
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
      console.log("  dragEdge: ", dragEdge);
      if (dragEdge.updateParent) {
        console.log("  updateParent");
        const parentPiece = closestParentPiece(e.evt.x, e.evt.y);
        console.log("    parentPiece: ", parentPiece);
        if (dragEdge.originalEdgeId!==undefined) {
          const originalEdge = edgeById(dragEdge.originalEdgeId);
          console.log("    originalEdge: ", originalEdge);
          if (parentPiece) {
            const edge = {
              childNodeId: originalEdge.childNodeId,
              parentNodeId: parentPiece.parentNodeId, 
              parentPieceId: parentPiece.parentPieceId,
            };
            setEdges(addEdge(removeEdge(edges, dragEdge.originalEdgeId), edge));
          } else {
            setEdges(removeEdge(edges, dragEdge.originalEdgeId));
          }
        } else {
          console.log("    no original edge");
          if (parentPiece) {
            // Note: if we do this we somehow get the wrong childNodeId
            // (Is the dragEdge.childY set wrong? Why?)
            //const childNodeId = closestChildId(dragEdge.childX, dragEdge.childY);
            //console.log("    childNodeId: ", childNodeId);
            const edge = {
              childNodeId: dragEdge.childNodeId,
              parentNodeId: parentPiece.parentNodeId, 
              parentPieceId: parentPiece.parentPieceId,
            };
            setEdges(addEdge(edges, edge));
          }
        }
      } else {
        console.log("  updateChild");
        const childNodeId = closestChildId(e.evt.x, e.evt.y);
        console.log("    childNodeId: ", childNodeId);
        if (dragEdge.originalEdgeId!==undefined) {
          const originalEdge = edgeById(dragEdge.originalEdgeId);
          console.log("    originalEdge: ", originalEdge);
          if (childNodeId) {
            const edge = {
              parentNodeId: originalEdge.parentNodeId,
              parentPieceId: originalEdge.parentPieceId,
              childNodeId: childNodeId,
            };
            setEdges(addEdge(removeEdge(edges, dragEdge.originalEdgeId), edge));
          } else {
            setEdges(removeEdge(edges, dragEdge.originalEdgeId));
          }
        } else {
          console.log("    no original edge");
          if (childNodeId) {
            // Note: if we do this we somehow get the wrong parentPieceId
            // (Is the dragEdge.parentX set wrong? Why?)
            //const parentPiece = closestParentPiece(dragEdge.parentX, dragEdge.parentY);
            const edge = {
              parentNodeId: dragEdge.parentNodeId, 
              parentPieceId: dragEdge.parentPieceId,
              childNodeId: childNodeId,          
            };
            setEdges(addEdge(edges, edge));
          }
        }
      }
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
