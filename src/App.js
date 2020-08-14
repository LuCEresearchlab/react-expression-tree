import React, { useEffect, useReducer } from 'react';
import Node from './Node.js';
import Edge from './Edge.js';
import { 
  Stage, 
  Layer, 
} from "react-konva";
import DragEdge from './DragEdge.js';
import { 
  computeNodeWidth, 
  computePiecesPositions, 
  xPad, 
  yPad, 
  textHeight, 
  targetRange,
  holeWidth,
} from './layout.js';
import reducer, { 
  getInitialDemoState,
  nodeById,
  edgeById,
  edgeByChildNode,
  edgeByParentPiece,
  nodePositionById,
} from './stateManagement.js';


function App() {
  const [state, dispatch] = useReducer(reducer, getInitialDemoState());

  // Layout functions
  const computeEdgeChildPos = (childNodeId) => {
    const nodePos = nodePositionById(state, childNodeId);
    return {
      x: nodePos.x + xPad + computeNodeWidth(nodeById(state, childNodeId).pieces)/2, 
      y: nodePos.y
    };
  };
  const computeEdgeParentPos = (parentNodeId, parentPieceId) => {
    const nodePos = nodePositionById(state, parentNodeId);
    return {
      x: nodePos.x + xPad + computePiecesPositions(nodeById(state, parentNodeId).pieces)[parentPieceId] + holeWidth/2, 
      y: nodePos.y + yPad + textHeight
    };
  };
  const distance = (x1, y1, x2, y2) => {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
  }
  const closestChildId = (x, y) => {
    let closestNodeId = null;
    let closestDist = null;
    state.nodes.forEach(node => {
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
    let closestPiece = null;
    let closestDist = null;
    state.nodes.forEach(node => {
      nodeById(state, node.id).pieces.forEach((piece, i) => {
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

  // Get access to DOM node corresponding to <Stage>
  // because we need to get key events from the DOM
  // (Konva doesn't provide key events).
  const stageRef = React.useRef();

  // Effects
  useEffect(()=>{
    // Request focus, so we can respond to key events
    const stage = stageRef.current;
    console.log("stage:", stage);
    console.log("stage.container():", stage.container());
    stage.container().tabIndex = 1;
    stage.container().focus();
    // Register (and later unregister) keydown listener
    const delListener = function (e) {
      console.log("STAGE keydown event: ", e);
      if (e.key === "Backspace" || e.key === "Delete") {
        if (state.selectedNodeId!==null) {
          dispatch({type: 'removeNode', payload: {nodeId: state.selectedNodeId}});
        }
      }
    };
    stage.container().addEventListener('keydown', delListener);
    console.log("STAGE keydown registered");
    return () => {
      stage.container().removeEventListener('keydown', delListener);
      console.log("STAGE keydown unregistered");
    }
  }, [state.nodes, state.selectedNodeId]);

  // Event handlers
  const handleNodeMove = (id, x, y) => {
    console.log("App.handleNodeMove(", id, x, y, ")");
    dispatch({type: 'moveNodeTo', payload: {nodeId: id, x: x, y: y}});
  };
  const handleNodeConnectorDragStart = (nodeId, x, y) => {
    console.log("App.handleNodeConnectorDragStart(", nodeId, x, y, ")");
    const edge = edgeByChildNode(state, nodeId);
    if (edge) {
      console.log("edge found:", edge);
      const parentPos = computeEdgeParentPos(edge.parentNodeId, edge.parentPieceId);
      const dragEdge = {
        originalEdgeId: edge.id,
        updateParent: false,
        parentNodeId: edge.parentNodeId,
        parentPieceId: edge.parentPieceId,
        parentX: parentPos.x,
        parentY: parentPos.y,
        childX: x,
        childY: y,
      };
      dispatch({type: 'setDragEdge', payload: {dragEdge}});
    } else {
      console.log("no edge found");
      const dragEdge = {
        originalEdgeId: null,
        updateParent: true,
        childNodeId: nodeId,
        childX: x,
        childY: y,
        parentX: x,
        parentY: y,
      };
      dispatch({type: 'setDragEdge', payload: {dragEdge}});
    }
  };
  const handlePieceConnectorDragStart = (nodeId, pieceId, x, y) => {
    console.log("App.handlePieceConnectorDragStart(", nodeId, pieceId, x, y, ")");
    const edge = edgeByParentPiece(state, nodeId, pieceId);
    if (edge) {
      console.log("edge found:", edge);
      const childPos = computeEdgeChildPos(edge.childNodeId);
      const dragEdge = {
        originalEdgeId: edge.id,
        updateParent: true,
        childNodeId: edge.childNodeId,
        childX: childPos.x,
        childY: childPos.y,
        parentX: x,
        parentY: y,
      };
      dispatch({type: 'setDragEdge', payload: {dragEdge}});
    } else {
      console.log("no edge found");
      const dragEdge = {
        originalEdgeId: null,
        updateParent: false,
        parentNodeId: nodeId,
        parentPieceId: pieceId,
        parentX: x,
        parentY: y,
        childX: x,
        childY: y,
      };
      dispatch({type: 'setDragEdge', payload: {dragEdge}});
    }
  };
  const handleStageMouseMove = (e) => {
    //console.log("App.handleStageMouseMove(", e, ")");
    //TODO: Provide drop target feedback
    //      (e.g., DragEdge color, Node's connector color)
    if (state.dragEdge) {
      if (state.dragEdge.updateParent) {
        dispatch({type: 'moveDragEdgeParentEndTo', payload: {x: e.evt.x, y: e.evt.y}});
      } else {
        dispatch({type: 'moveDragEdgeChildEndTo', payload: {x: e.evt.x, y: e.evt.y}});
      }
    }
  };
  const handleStageMouseUp = (e) => {
    console.log("App.handleStageMouseUp(", e, ")");
    if (state.dragEdge) {
      console.log("  dragEdge: ", state.dragEdge);
      if (state.dragEdge.updateParent) {
        console.log("  updateParent");
        const parentPiece = closestParentPiece(e.evt.x, e.evt.y);
        console.log("    parentPiece: ", parentPiece);
        if (state.dragEdge.originalEdgeId!==null) {
          const originalEdge = edgeById(state.dragEdge.originalEdgeId);
          console.log("    originalEdge: ", originalEdge);
          dispatch({type: 'removeEdge', payload: {edgeId: state.dragEdge.originalEdgeId}});
          if (parentPiece) {
            const edge = {
              childNodeId: originalEdge.childNodeId,
              parentNodeId: parentPiece.parentNodeId, 
              parentPieceId: parentPiece.parentPieceId,
            };
            dispatch({type: 'addEdge', payload: {edge}});
          }
        } else {
          console.log("    no original edge");
          if (parentPiece) {
            // Note: if we do this we somehow get the wrong childNodeId
            // (Is the dragEdge.childY set wrong? Why?)
            //const childNodeId = closestChildId(dragEdge.childX, dragEdge.childY);
            //console.log("    childNodeId: ", childNodeId);
            const edge = {
              childNodeId: state.dragEdge.childNodeId,
              parentNodeId: parentPiece.parentNodeId, 
              parentPieceId: parentPiece.parentPieceId,
            };
            dispatch({type: 'addEdge', payload: {edge}});
          }
        }
      } else {
        console.log("  updateChild");
        const childNodeId = closestChildId(e.evt.x, e.evt.y);
        console.log("    childNodeId: ", childNodeId);
        if (state.dragEdge.originalEdgeId!==null) {
          const originalEdge = edgeById(state, state.dragEdge.originalEdgeId);
          console.log("    originalEdge: ", originalEdge);
          dispatch({type: 'removeEdge', payload: {edgeId: state.dragEdge.originalEdgeId}});
          if (childNodeId) {
            const edge = {
              parentNodeId: originalEdge.parentNodeId,
              parentPieceId: originalEdge.parentPieceId,
              childNodeId: childNodeId,
            };
            dispatch({type: 'addEdge', payload: {edge}});
          }
        } else {
          console.log("    no original edge");
          if (childNodeId) {
            // Note: if we do this we somehow get the wrong parentPieceId
            // (Is the dragEdge.parentX set wrong? Why?)
            //const parentPiece = closestParentPiece(dragEdge.parentX, dragEdge.parentY);
            const edge = {
              parentNodeId: state.dragEdge.parentNodeId, 
              parentPieceId: state.dragEdge.parentPieceId,
              childNodeId: childNodeId,          
            };
            dispatch({type: 'addEdge', payload: {edge}});
          }
        }
      }
      dispatch({type: 'clearDragEdge'});
    }
  };
  const handleStageClick = (e) => {
    console.log("App.handleStageClick(", e, ")");
    dispatch({type: 'clearNodeSelection', debug: {e}});
  }
  const handleStageDblClick = (e) => {
    console.log("App.handleStageDblClick(", e, ")");
    const piecesString = prompt(
      "CREATE NEW AST NODE. Describe the node's pieces as a JSON array. Holes are null, other pieces are strings.", 
      "[\"Math.max(\", null, \",\", null, \")\"]");
    console.log("piecesString:", piecesString);
    const pieces = JSON.parse(piecesString);
    dispatch({type: 'addNode', payload: {
      pieces,
      x: e.evt.x,
      y: e.evt.y,
    }});
  }
  const handleNodeClick = (e, nodeId) => {
    dispatch({type: 'selectNode', payload: {nodeId}});
  }

  return (
    <Stage 
      ref={stageRef}
      width={window.innerWidth} 
      height={window.innerHeight}
      onMouseMove={handleStageMouseMove}
      onMouseUp={handleStageMouseUp}
      onClick={handleStageClick}
      onDblClick={handleStageDblClick}
    >
      <Layer>
        {
          state.edges.map((edge,i) => (
            <Edge
              key={"Edge-"+edge.id}
              id={edge.id}
              beingDragged={state.dragEdge && state.dragEdge.originalEdgeId===edge.id}
              parentPieces={nodeById(state, edge.parentNodeId).pieces}
              parentPieceId={edge.parentPieceId}
              childPieces={nodeById(state, edge.childNodeId).pieces}
              parentX={nodePositionById(state, edge.parentNodeId).x}
              parentY={nodePositionById(state, edge.parentNodeId).y}
              childX={nodePositionById(state, edge.childNodeId).x}
              childY={nodePositionById(state, edge.childNodeId).y}
            />
          ))
        }
        {
          state.nodes.map((node,i) => (
            <Node
              key={"Node-"+node.id}
              id={node.id}
              x={nodePositionById(state, node.id).x}
              y={nodePositionById(state, node.id).y}
              pieces={node.pieces}
              selected={state.selectedNodeId===node.id}
              onNodeMove={handleNodeMove}
              onNodeConnectorDragStart={handleNodeConnectorDragStart}
              onPieceConnectorDragStart={handlePieceConnectorDragStart}
              onNodeClick={(e) => handleNodeClick(e, node.id)}
            />
          ))
        }
        { state.dragEdge &&
          <DragEdge
            key="DragEdge"
            x1={state.dragEdge.parentX}
            y1={state.dragEdge.parentY}
            x2={state.dragEdge.childX}
            y2={state.dragEdge.childY}
          />
        }
      </Layer>
    </Stage>
  );
}

export default App;
