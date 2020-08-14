import reducer, {
  nodeById,
  edgeById,
  edgeByChildNode,
  edgeByParentPiece,
  nodePositionById,
} from './stateManagement.js';

it('runs tests', () => {
  expect(1).toBe(1);
});

describe('lookup functions', () => {
  it('nodeById should find node', () => {
    const node = {id: 3, whatever: 1};
    expect(nodeById({nodes: [{id: 1}, node, {id: 2}]}, 3)).toBe(node);
  });
  it('nodeById should throw for null id', () => {
    expect(() => nodeById({nodes: []}, null)).toThrow(Error);
  });
  it('nodeById should throw for undefined id', () => {
    expect(() => nodeById({nodes: []}, undefined)).toThrow(Error);
  });
  it('nodeById should throw if node not found', () => {
    expect(() => nodeById({nodes: []}, 1)).toThrow(Error);
  });

  it('edgeById should find edge', () => {
    const edge = {id: 3, whatever: 1};
    expect(edgeById({edges: [{id: 1}, edge, {id: 2}]}, 3)).toBe(edge);
  });
  it('edgeById should throw for null id', () => {
    expect(() => edgeById({edges: []}, null)).toThrow(Error);
  });
  it('edgeById should throw for undefined id', () => {
    expect(() => edgeById({edges: []}, undefined)).toThrow(Error);
  });
  it('edgeById should throw if edge not found', () => {
    expect(() => edgeById({edges: []}, 1)).toThrow(Error);
  });

  it('edgeByChildNode should find edge', () => {
    const edge = {id: 3, childNodeId: 5};
    expect(edgeByChildNode({edges: [{id: 1, childNodeId: 2}, edge, {id: 2, childNodeId: 3}]}, 5)).toBe(edge);
  });

  it('edgeByParentPiece should find edge', () => {
    const edge = {id: 3, parentNodeId: 5, parentPieceId: 10};
    expect(edgeByParentPiece({
      edges: [
        {id: 1, parentNodeId: 5, parentPieceId: 6}, 
        edge, 
        {id: 2, parentNodeId: 6, parentPieceId: 10}
      ]}, edge.parentNodeId, edge.parentPieceId)
    ).toBe(edge);
  });

  it('nodePositionById should find node', () => {
    const nodePosition = {id: 3, whatever: 1};
    expect(nodePositionById({nodePositions: [{id: 1}, nodePosition, {id: 2}]}, 3)).toBe(nodePosition);
  });
});

describe('reducer', () => {

  it('should handle addNode', () => {
    const pieces = ["a", null, "b"];
    expect(reducer({
      nodes: [],
      nodePositions: [],
    }, {type: 'addNode', payload: {pieces, x: 10, y: 20}})).toEqual({
      nodes: [{id: 1, pieces}],
      nodePositions: [{id: 1, x: 10, y: 20}],
      selectedNodeId: 1,
    });
    expect(reducer({
      nodes: [{id: 9}], 
      nodePositions: [{id: 9}],
    }, {type: 'addNode', payload: {pieces, x: 100, y: 200}})).toEqual({
      nodes: [{id: 9}, {id: 10, pieces}], 
      nodePositions: [{id: 9}, {id: 10, x: 100, y: 200}], 
      selectedNodeId: 10,
    });
  });

  it('should handle removeNode', () => {
    expect(reducer({
      nodes: [{id: 5}],
      edges: [],
      nodePositions: [{id: 5}],
      selectedNodeId: 5,
    }, {type: 'removeNode', payload: {nodeId: 5}})).toEqual({
      nodes: [],
      edges: [],
      nodePositions: [],
      selectedNodeId: null,
    });
    expect(reducer({
      nodes: [{id: 9}, {id: 2}, {id: 3}], 
      edges: [],
      nodePositions: [{id: 9}, {id: 2}, {id: 3}],
      selectedNodeId: 3,
    }, {type: 'removeNode', payload: {nodeId: 2}})).toEqual({
      nodes: [{id: 9}, {id: 3}], 
      edges: [],
      nodePositions: [{id: 9}, {id: 3}], 
      selectedNodeId: 3,
    });
    expect(reducer({
      nodes: [{id: 9}, {id: 2}, {id: 3}, {id: 4}], 
      edges: [
        {id: 1, parentNodeId: 9, parentPieceId:0, childNodeId: 2},
        {id: 2, parentNodeId: 2, parentPieceId:0, childNodeId: 3},
        {id: 3, parentNodeId: 9, parentPieceId: 1, childNodeId: 4},
      ],
      nodePositions: [{id: 9}, {id: 2}, {id: 3}, {id: 4}],
      selectedNodeId: null,
    }, {type: 'removeNode', payload: {nodeId: 2}})).toEqual({
      nodes: [{id: 9}, {id: 3}, {id: 4}], 
      edges: [
        {id: 3, parentNodeId: 9, parentPieceId: 1, childNodeId: 4},
      ],
      nodePositions: [{id: 9}, {id: 3}, {id: 4}], 
      selectedNodeId: null,
    });
  });

  it('should handle selectNode', () => {
    expect(reducer({
      selectedNodeId: 1
    }, {type: 'selectNode', payload: {nodeId: 9}})).toEqual({
      selectedNodeId: 9
    });
    expect(reducer({
      nodes: [], 
      edges: [], 
      selectedNodeId: 1
    }, {type: 'selectNode', payload: {nodeId: 99}})).toEqual({
      nodes: [], 
      edges: [], 
      selectedNodeId: 99
    });
  });

  it('should handle clearNodeSelection', () => {
    expect(reducer({
      selectedNodeId: 1
    }, {type: 'clearNodeSelection'})).toEqual({
      selectedNodeId: null
    });
    expect(reducer({
      nodes: [], 
      edges: [], 
      selectedNodeId: 1
    }, {type: 'clearNodeSelection'})).toEqual({
      nodes: [], 
      edges: [], 
      selectedNodeId: null
    });
  });

  it('should handle moveNodeTo', () => {
    expect(reducer({
      nodePositions: [{id: 9, x: 10, y: 20}],
    }, {type: 'moveNodeTo', payload: {nodeId: 9, x: 30, y: 40}})).toEqual({
      nodePositions: [{id: 9, x: 30, y: 40}],
      selectedNodeId: 9,
    });
    expect(reducer({
      nodes: [], 
      edges: [], 
      nodePositions: [{id: 1}, {id: 99, x: 10, y: 20}, {id: 10}],
    }, {type: 'moveNodeTo', payload: {nodeId: 99, x: 100, y: 200}})).toEqual({
      nodes: [], 
      edges: [], 
      nodePositions: [{id: 1}, {id: 99, x: 100, y: 200}, {id: 10}],
      selectedNodeId: 99,
    });
  });

  it('should handle addEdge', () => {
    const edge = {whatever: 1};
    expect(reducer({
      edges: [],
    }, {type: 'addEdge', payload: {edge}})).toEqual({
      edges: [{id: 1, ...edge}],
    });
    expect(reducer({
      edges: [{id: 9}], 
    }, {type: 'addEdge', payload: {edge}})).toEqual({
      edges: [{id: 9}, {id: 10, ...edge}], 
    });
  });

  it('should handle removeEdge', () => {
    expect(reducer({
      edges: [{id: 2}],
    }, {type: 'removeEdge', payload: {edgeId: 2}})).toEqual({
      edges: [],
    });
    expect(reducer({
      nodes: [],
      edges: [{id: 9}, {id: 2}, {id: 3}], 
    }, {type: 'removeEdge', payload: {edgeId: 2}})).toEqual({
      nodes: [],
      edges: [{id: 9}, {id: 3}], 
    });
  });

  it('should handle setDragEdge', () => {
    const dragEdge = {whatever: 1};
    expect(reducer({
      dragEdge: null,
    }, {type: 'setDragEdge', payload: {dragEdge}})).toEqual({
      dragEdge,
    });
    expect(reducer({
      nodes: [], 
      edges: [], 
      dragEdge: {},
    }, {type: 'setDragEdge', payload: {dragEdge}})).toEqual({
      nodes: [], 
      edges: [], 
      dragEdge
    });
  });

  it('should handle moveDragEdgeParentEndTo', () => {
    expect(reducer({
      dragEdge: {},
    }, {type: 'moveDragEdgeParentEndTo', payload: {x: 10, y: 20}})).toEqual({
      dragEdge: {parentX: 10, parentY: 20},
    });
    expect(reducer({
      nodes: [], 
      edges: [], 
      dragEdge: {parentX: 1, parentY: 2, childX: 3, childY: 4},
    }, {type: 'moveDragEdgeParentEndTo', payload: {x: 100, y: 200}})).toEqual({
      nodes: [], 
      edges: [], 
      dragEdge: {parentX: 100, parentY: 200, childX: 3, childY: 4},
    });
  });

  it('should handle moveDragEdgeChildEndTo', () => {
    expect(reducer({
      dragEdge: {},
    }, {type: 'moveDragEdgeChildEndTo', payload: {x: 10, y: 20}})).toEqual({
      dragEdge: {childX: 10, childY: 20},
    });
    expect(reducer({
      nodes: [], 
      edges: [], 
      dragEdge: {parentX: 1, parentY: 2, childX: 3, childY: 4},
    }, {type: 'moveDragEdgeChildEndTo', payload: {x: 300, y: 400}})).toEqual({
      nodes: [], 
      edges: [], 
      dragEdge: {parentX: 1, parentY: 2, childX: 300, childY: 400},
    });
  });

  it('should handle clearDragEdge', () => {
    expect(reducer({
      dragEdge: 1
    }, {type: 'clearDragEdge'})).toEqual({
      dragEdge: null
    });
    expect(reducer({
      nodes: [], 
      edges: [], 
      dragEdge: 1
    }, {type: 'clearDragEdge'})).toEqual({
      nodes: [], 
      edges: [], 
      dragEdge: null
    });
  });

  it('should throw for unknown actions', () => {
    expect(() => reducer({}, {type: 'UNKNOWN'})).toThrow(Error);
  });
});
