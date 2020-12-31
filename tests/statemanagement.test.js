/* eslint-disable no-undef */
import {
  nodeById,
  edgeById,
  edgeByChildNode,
  edgeByParentPiece,
  nodePositionById,
} from '../src/components/utils';

import reducer from '../src/components/store/reducers';

let state = {
  editor: {
    nodes: [],
    edges: [],
    dragEdge: null,
    selectedNode: null,
    selectedEdge: null,
    selectedRootNode: null,
  },
  drawer: {
    addingNode: false,
    addValue: [],
    editValue: [],
    typeValue: '',
    nodeValue: '',
  },
};

describe('lookup functions', () => {
  it('nodeById should find node', () => {
    const node = { id: 3 };
    const nodes = [{ id: 1 }, node, { id: 2 }];
    expect(nodeById(node.id, nodes)).toBe(node);
  });
  it('nodeById should throw for null id', () => {
    const nodes = [];
    expect(() => nodeById(null, nodes)).toThrow(Error);
  });
  it('nodeById should throw for undefined id', () => {
    const nodes = [];
    expect(() => nodeById(undefined, nodes)).toThrow(Error);
  });
  it('nodeById should throw if node not found', () => {
    const nodes = [];
    expect(() => nodeById(1, nodes)).toThrow(Error);
  });

  it('edgeById should find edge', () => {
    const edge = { id: 3 };
    const edges = [{ id: 1 }, edge, { id: 2 }];
    expect(edgeById(edge.id, edges)).toBe(edge);
  });
  it('edgeById should throw for null id', () => {
    const edges = [];
    expect(() => edgeById(null, edges)).toThrow(Error);
  });
  it('edgeById should throw for undefined id', () => {
    const edges = [];
    expect(() => edgeById(undefined, edges)).toThrow(Error);
  });
  it('edgeById should throw if edge not found', () => {
    const edges = [];
    expect(() => edgeById(1, edges)).toThrow(Error);
  });

  it('edgeByChildNode should find edge', () => {
    const edge = { id: 3, childNodeId: 5 };
    const edges = [{ id: 1, childNodeId: 2 }, edge, { id: 2, childNodeId: 3 }];
    expect(edgeByChildNode(5, edges)).toStrictEqual([edge]);
  });
  it('edgeByChildNode should return empty array if edge not found', () => {
    const edges = [];
    expect(edgeByChildNode(5, edges)).toStrictEqual([]);
  });

  it('edgeByParentPiece should find edge', () => {
    const edge = { id: 3, parentNodeId: 5, parentPieceId: 10 };
    const edges = [
      { id: 1, parentNodeId: 5, parentPieceId: 6 },
      edge,
      { id: 2, parentNodeId: 6, parentPieceId: 10 },
    ];
    expect(
      edgeByParentPiece(edge.parentNodeId, edge.parentPieceId, edges),
    ).toStrictEqual([edge]);
  });
  it('edgeByParentPiece should return empty array if edge not found', () => {
    const edge = { id: 3, parentNodeId: 5, parentPieceId: 10 };
    const edges = [];
    expect(
      edgeByParentPiece(edge.parentNodeId, edge.parentPieceId, edges),
    ).toStrictEqual([]);
  });

  it('nodePositionById should find node', () => {
    const nodePosition = { x: 10, y: 20 };
    const nodes = [
      { id: 1, x: 20, y: 10 },
      { id: 3, x: 10, y: 20 },
      { id: 2, x: 30, y: 40 },
    ];
    expect(nodePositionById(3, nodes)).toStrictEqual(nodePosition);
  });
  it('nodePositionById should throw for null id', () => {
    const nodes = [
      { id: 1, x: 20, y: 10 },
      { id: 3, x: 10, y: 20 },
      { id: 2, x: 30, y: 40 },
    ];
    expect(() => nodePositionById(undefined, nodes)).toThrow(Error);
  });
  it('nodePositionById should throw for undefined id', () => {
    const nodes = [
      { id: 1, x: 20, y: 10 },
      { id: 3, x: 10, y: 20 },
      { id: 2, x: 30, y: 40 },
    ];
    expect(() => nodePositionById(undefined, nodes)).toThrow(Error);
  });
  it('nodePositionById should throw if node not found', () => {
    const nodes = [];
    expect(() => nodePositionById(1, nodes)).toThrow(Error);
  });
});

describe('editor reducer', () => {
  it('should handle addNode', () => {
    const pieces = ['a', '{{}}', 'b'];
    state = reducer(state, {
      type: 'addNode',
      payload: {
        pieces,
        x: 10,
        y: 20,
        type: '',
        value: '',
        isFinal: false,
        onNodeAdd: () => {},
      },
    });
    expect(state.editor.present.nodes).toEqual([
      {
        id: 1,
        pieces,
        x: 10,
        y: 20,
        type: '',
        value: '',
        isFinal: false,
      },
    ]);
    state = reducer(state, {
      type: 'addNode',
      payload: {
        pieces,
        x: 100,
        y: 200,
        type: '',
        value: '',
        isFinal: false,
        onNodeAdd: () => {},
      },
    });
    expect(state.editor.present.nodes).toEqual([
      {
        id: 1, pieces, x: 10, y: 20, type: '', value: '', isFinal: false,
      },
      {
        id: 2, pieces, x: 100, y: 200, type: '', value: '', isFinal: false,
      },
    ]);
    state = reducer(state, {
      type: 'addNode',
      payload: {
        pieces,
        x: 20,
        y: 10,
        type: '',
        value: '',
        isFinal: false,
        onNodeAdd: () => {},
      },
    });
    expect(state.editor.present.nodes).toEqual([
      {
        id: 1, pieces, x: 10, y: 20, type: '', value: '', isFinal: false,
      },
      {
        id: 2, pieces, x: 100, y: 200, type: '', value: '', isFinal: false,
      },
      {
        id: 3, pieces, x: 20, y: 10, type: '', value: '', isFinal: false,
      },
    ]);
    state = reducer(state, {
      type: 'addNode',
      payload: {
        pieces,
        x: 200,
        y: 100,
        type: '',
        value: '',
        isFinal: true,
        onNodeAdd: () => {},
      },
    });
    expect(state.editor.present.nodes).toEqual([
      {
        id: 1, pieces, x: 10, y: 20, type: '', value: '', isFinal: false,
      },
      {
        id: 2, pieces, x: 100, y: 200, type: '', value: '', isFinal: false,
      },
      {
        id: 3, pieces, x: 20, y: 10, type: '', value: '', isFinal: false,
      },
      {
        id: 4, pieces, x: 200, y: 100, type: '', value: '', isFinal: true,
      },
    ]);
  });

  it('should handle nodeTypeEdit and nodeValueEdit', () => {
    state = reducer(state, {
      type: 'nodeTypeEdit',
      payload: {
        type: 'String',
        selectedNodeId: 1,
        onNodeTypeChange: () => {},
      },
    });
    state = reducer(state, {
      type: 'nodeValueEdit',
      payload: {
        value: '"Hello world!"',
        selectedNodeId: 1,
        onNodeValueChange: () => {},
      },
    });
    expect(state.editor.present.nodes).toEqual([
      {
        id: 1,
        pieces: ['a', '{{}}', 'b'],
        x: 10,
        y: 20,
        type: 'String',
        value: '"Hello world!"',
        isFinal: false,
      },
      {
        id: 2,
        pieces: ['a', '{{}}', 'b'],
        x: 100,
        y: 200,
        type: '',
        value: '',
        isFinal: false,
      },
      {
        id: 3,
        pieces: ['a', '{{}}', 'b'],
        x: 20,
        y: 10,
        type: '',
        value: '',
        isFinal: false,
      },
      {
        id: 4,
        pieces: ['a', '{{}}', 'b'],
        x: 200,
        y: 100,
        type: '',
        value: '',
        isFinal: true,
      },
    ]);
  });

  it('should handle addEdge', () => {
    const edge1 = {
      childNodeId: 2,
      parentNodeId: 1,
      parentPieceId: 1,
    };
    state = reducer(state, {
      type: 'addEdge',
      payload: { edge: edge1, onEdgeAdd: () => {} },
    });
    expect(state.editor.present.edges).toEqual([{ id: 1, ...edge1 }]);
    const edge2 = {
      childNodeId: 3,
      parentNodeId: 2,
      parentPieceId: 1,
    };
    state = reducer(state, {
      type: 'addEdge',
      payload: { edge: edge2, onEdgeAdd: () => {} },
    });
    expect(state.editor.present.edges).toEqual([
      { id: 1, ...edge1 },
      { id: 2, ...edge2 },
    ]);
    const edge3 = {
      childNodeId: 4,
      parentNodeId: 3,
      parentPieceId: 1,
    };
    state = reducer(state, {
      type: 'addEdge',
      payload: { edge: edge3, onEdgeAdd: () => {} },
    });
    expect(state.editor.present.edges).toEqual([
      { id: 1, ...edge1 },
      { id: 2, ...edge2 },
      { id: 3, ...edge3 },
    ]);
  });

  it('should handle updateEdge', () => {
    const newEdge3 = {
      id: 3,
      childNodeId: 1,
      parentNodeId: 1,
      parentPieceId: 1,
    };
    state = reducer(state, {
      type: 'updateEdge',
      payload: { edgeId: 3, newEdge: newEdge3, onEdgeUpdate: () => {} },
    });
    expect(state.editor.present.edges).toEqual([
      {
        id: 1, childNodeId: 2, parentNodeId: 1, parentPieceId: 1,
      },
      {
        id: 2, childNodeId: 3, parentNodeId: 2, parentPieceId: 1,
      },
      {
        id: 3, childNodeId: 1, parentNodeId: 1, parentPieceId: 1,
      },
    ]);
  });

  it('should handle selectNode, clearNodeSelection', () => {
    state = reducer(state, {
      type: 'selectNode',
      payload: { selectedNode: { id: 2 }, onNodeSelect: () => {} },
    });
    expect(state.editor.present.selectedNode.id).toEqual(2);
    state = reducer(state, {
      type: 'clearNodeSelection',
    });
    expect(state.editor.present.selectedNode).toEqual(null);
  });

  it('should handle selectRootNode, clearRootSelection', () => {
    const selectedRootNode = nodeById(1, state.editor.present.nodes);
    state = reducer(state, {
      type: 'selectRootNode',
      payload: { selectedRootNode },
    });
    expect(state.editor.present.selectedRootNode).toEqual(selectedRootNode);
    state = reducer(state, {
      type: 'clearRootSelection',
    });
    expect(state.editor.present.selectedRootNode).toEqual(null);
  });

  it('should handle selectEdge, clearEdgeSelection', () => {
    state = reducer(state, {
      type: 'selectEdge',
      payload: { selectedEdge: { id: 1 }, onEdgeSelect: () => {} },
    });
    expect(state.editor.present.selectedEdge.id).toEqual(1);
    state = reducer(state, {
      type: 'clearEdgeSelection',
    });
    expect(state.editor.present.selectedEdge).toEqual(null);
  });

  it('should handle moveNodeTo', () => {
    state = reducer(state, {
      type: 'moveNodeTo',
      payload: { nodeId: 3, x: 30, y: 40 },
    });
    expect(state.editor.present.nodes).toEqual([
      {
        id: 1,
        pieces: ['a', '{{}}', 'b'],
        x: 10,
        y: 20,
        type: 'String',
        value: '"Hello world!"',
        isFinal: false,
      },
      {
        id: 2,
        pieces: ['a', '{{}}', 'b'],
        x: 100,
        y: 200,
        type: '',
        value: '',
        isFinal: false,
      },
      {
        id: 3,
        pieces: ['a', '{{}}', 'b'],
        x: 30,
        y: 40,
        type: '',
        value: '',
        isFinal: false,
      },
      {
        id: 4,
        pieces: ['a', '{{}}', 'b'],
        x: 200,
        y: 100,
        type: '',
        value: '',
        isFinal: true,
      },
    ]);
    state = reducer(state, {
      type: 'moveNodeTo',
      payload: { nodeId: 1, x: 40, y: 30 },
    });
    expect(state.editor.present.nodes).toEqual([
      {
        id: 1,
        pieces: ['a', '{{}}', 'b'],
        x: 40,
        y: 30,
        type: 'String',
        value: '"Hello world!"',
        isFinal: false,
      },
      {
        id: 2,
        pieces: ['a', '{{}}', 'b'],
        x: 100,
        y: 200,
        type: '',
        value: '',
        isFinal: false,
      },
      {
        id: 3,
        pieces: ['a', '{{}}', 'b'],
        x: 30,
        y: 40,
        type: '',
        value: '',
        isFinal: false,
      },
      {
        id: 4,
        pieces: ['a', '{{}}', 'b'],
        x: 200,
        y: 100,
        type: '',
        value: '',
        isFinal: true,
      },
    ]);
  });

  it('should handle setDragEdge, clearDragEdge', () => {
    const dragEdge1 = {
      originalEdgeId: null,
      updateParent: false,
      parentNodeId: 4,
      parentX: 200,
      parentY: 100,
      childX: 40,
      childY: 30,
    };
    state = reducer(state, {
      type: 'setDragEdge',
      payload: { dragEdge: dragEdge1 },
    });
    expect(state.editor.present.dragEdge).toEqual({ ...dragEdge1 });
    state = reducer(state, { type: 'clearDragEdge' });
    expect(state.editor.present.dragEdge).toEqual(null);
    const dragEdge2 = {
      originalEdgeId: 3,
      updateParent: false,
      parentNodeId: 3,
      parentPieceId: 1,
      parentX: 30,
      parentY: 40,
      childX: 200,
      childY: 100,
    };
    state = reducer(state, {
      type: 'setDragEdge',
      payload: { dragEdge: dragEdge2 },
    });
    expect(state.editor.present.dragEdge).toEqual({ ...dragEdge2 });
  });

  it('should handle moveDragEdgeParentEndTo', () => {
    state = reducer(state, {
      type: 'moveDragEdgeParentEndTo',
      payload: { x: 10, y: 20 },
    });
    expect(state.editor.present.dragEdge.parentX).toEqual(10);
    expect(state.editor.present.dragEdge.parentY).toEqual(20);
    state = reducer(state, {
      type: 'moveDragEdgeParentEndTo',
      payload: { x: 100, y: 200 },
    });
    expect(state.editor.present.dragEdge.parentX).toEqual(100);
    expect(state.editor.present.dragEdge.parentY).toEqual(200);
  });

  it('should handle moveDragEdgeChildEndTo', () => {
    state = reducer(state, {
      type: 'moveDragEdgeChildEndTo',
      payload: { x: 10, y: 20 },
    });
    expect(state.editor.present.dragEdge.childX).toEqual(10);
    expect(state.editor.present.dragEdge.childY).toEqual(20);
    state = reducer(state, {
      type: 'moveDragEdgeChildEndTo',
      payload: { x: 100, y: 200 },
    });
    expect(state.editor.present.dragEdge.childX).toEqual(100);
    expect(state.editor.present.dragEdge.childY).toEqual(200);
  });

  it('should handle removeEdge', () => {
    state = reducer(state, {
      type: 'removeEdge',
      payload: { edgeId: 3, onEdgeDelete: () => {} },
    });
    expect(state.editor.present.edges).toEqual([
      {
        id: 1, childNodeId: 2, parentNodeId: 1, parentPieceId: 1,
      },
      {
        id: 2, childNodeId: 3, parentNodeId: 2, parentPieceId: 1,
      },
    ]);
  });

  it('should handle editNode', () => {
    state = reducer(state, {
      type: 'editNode',
      payload: {
        pieces: ['a', '{{}}', 'c'],
        selectedNodeId: 2,
        onNodePiecesChange: () => {},
      },
    });
    expect(state.editor.present.nodes).toEqual([
      {
        id: 1,
        pieces: ['a', '{{}}', 'b'],
        x: 40,
        y: 30,
        type: 'String',
        value: '"Hello world!"',
        isFinal: false,
      },
      {
        id: 2,
        pieces: ['a', '{{}}', 'c'],
        x: 100,
        y: 200,
        type: '',
        value: '',
        isFinal: false,
      },
      {
        id: 3,
        pieces: ['a', '{{}}', 'b'],
        x: 30,
        y: 40,
        type: '',
        value: '',
        isFinal: false,
      },
      {
        id: 4,
        pieces: ['a', '{{}}', 'b'],
        x: 200,
        y: 100,
        type: '',
        value: '',
        isFinal: true,
      },
    ]);
    expect(state.editor.present.edges).toEqual([
      {
        id: 1, childNodeId: 2, parentNodeId: 1, parentPieceId: 1,
      },
    ]);
  });

  it('should handle removeNode', () => {
    state = reducer(state, {
      type: 'removeNode',
      payload: { nodeId: 2, onNodeDelete: () => {} },
    });
    expect(state.editor.present.nodes).toEqual([
      {
        id: 1,
        pieces: ['a', '{{}}', 'b'],
        x: 40,
        y: 30,
        type: 'String',
        value: '"Hello world!"',
        isFinal: false,
      },
      {
        id: 3,
        pieces: ['a', '{{}}', 'b'],
        x: 30,
        y: 40,
        type: '',
        value: '',
        isFinal: false,
      },
      {
        id: 4,
        pieces: ['a', '{{}}', 'b'],
        x: 200,
        y: 100,
        type: '',
        value: '',
        isFinal: true,
      },
    ]);
    expect(state.editor.present.edges).toEqual([]);
  });

  it('should handle stageReset', () => {
    state = reducer(state, {
      type: 'stageReset',
      payload: { initialNodes: [], initialEdges: [] },
    });
    expect(state.editor.present).toEqual({
      nodes: [],
      edges: [],
      dragEdge: null,
      selectedNode: null,
      selectedEdge: null,
      selectedRootNode: null,
    });
  });
});

describe('drawer reducer', () => {
  it('should handle addingNodeClick and clearAdding', () => {
    state = reducer(state, {
      type: 'addingNodeClick',
    });
    expect(state.drawer.addingNode).toEqual(true);
    state = reducer(state, {
      type: 'addingNodeClick',
    });
    expect(state.drawer.addingNode).toEqual(false);
    state = reducer(state, {
      type: 'addingNodeClick',
    });
    expect(state.drawer.addingNode).toEqual(true);
    state = reducer(state, {
      type: 'clearAdding',
    });
    expect(state.drawer.addingNode).toEqual(false);
  });

  it('should handle addValueChange', () => {
    state = reducer(state, {
      type: 'addValueChange',
      payload: { addValue: ['a', '{{}}', 'b'] },
    });
    expect(state.drawer.addValue).toEqual(['a', '{{}}', 'b']);
  });

  it('should handle editValueChange', () => {
    state = reducer(state, {
      type: 'editValueChange',
      payload: { editValue: ['a', '{{}}', 'c'] },
    });
    expect(state.drawer.editValue).toEqual(['a', '{{}}', 'c']);
  });

  it('should handle typeValueChange', () => {
    state = reducer(state, {
      type: 'typeValueChange',
      payload: { typeValue: 'String' },
    });
    expect(state.drawer.typeValue).toEqual('String');
  });

  it('should handle nodeValueChange', () => {
    state = reducer(state, {
      type: 'nodeValueChange',
      payload: { nodeValue: '"Hello World!' },
    });
    expect(state.drawer.nodeValue).toEqual('"Hello World!');
  });
});
