import {
  nodeById,
  edgeById,
  edgeByChildNode,
  edgeByParentPiece,
  nodePositionById,
} from "./utils.js";
import reducer from "./store/reducers";

var state = {
  editor: {
    nodes: [],
    edges: [],
    nodePositions: [],
    dragEdge: null,
    selectedNode: null,
    selectedEdge: null,
  },
  drawer: {},
};

describe("lookup functions", () => {
  it("nodeById should find node", () => {
    const node = { id: 3 };
    const nodes = [{ id: 1 }, node, { id: 2 }];
    expect(nodeById(node.id, nodes)).toBe(node);
  });
  it("nodeById should throw for null id", () => {
    const nodes = [];
    expect(() => nodeById(null, nodes)).toThrow(Error);
  });
  it("nodeById should throw for undefined id", () => {
    const nodes = [];
    expect(() => nodeById(undefined, nodes)).toThrow(Error);
  });
  it("nodeById should throw if node not found", () => {
    const nodes = [];
    expect(() => nodeById(1, nodes)).toThrow(Error);
  });

  it("edgeById should find edge", () => {
    const edge = { id: 3 };
    const edges = [{ id: 1 }, edge, { id: 2 }];
    expect(edgeById(edge.id, edges)).toBe(edge);
  });
  it("edgeById should throw for null id", () => {
    const edges = [];
    expect(() => edgeById(null, edges)).toThrow(Error);
  });
  it("edgeById should throw for undefined id", () => {
    const edges = [];
    expect(() => edgeById(undefined, edges)).toThrow(Error);
  });
  it("edgeById should throw if edge not found", () => {
    const edges = [];
    expect(() => edgeById(1, edges)).toThrow(Error);
  });

  it("edgeByChildNode should find edge", () => {
    const edge = { id: 3, childNodeId: 5 };
    const edges = [{ id: 1, childNodeId: 2 }, edge, { id: 2, childNodeId: 3 }];
    expect(edgeByChildNode(5, edges)).toBe(edge);
  });

  it("edgeByParentPiece should find edge", () => {
    const edge = { id: 3, parentNodeId: 5, parentPieceId: 10 };
    const edges = [
      { id: 1, parentNodeId: 5, parentPieceId: 6 },
      edge,
      { id: 2, parentNodeId: 6, parentPieceId: 10 },
    ];
    expect(
      edgeByParentPiece(edge.parentNodeId, edge.parentPieceId, edges)
    ).toBe(edge);
  });

  it("nodePositionById should find node", () => {
    const nodePosition = { id: 3 };
    const nodePositions = [{ id: 1 }, nodePosition, { id: 2 }];
    expect(nodePositionById(3, nodePositions)).toBe(nodePosition);
  });
});

describe("reducer", () => {
  it("should handle addNode", () => {
    const pieces = ["a", null, "b"];
    state = reducer(state, {
      type: "addNode",
      payload: { pieces, x: 10, y: 20 },
    });
    expect(state.editor.nodes).toEqual([{ id: 1, pieces }]);
    expect(state.editor.nodePositions).toEqual([{ id: 1, x: 10, y: 20 }]);
    state = reducer(state, {
      type: "addNode",
      payload: { pieces, x: 100, y: 200 },
    });
    expect(state.editor.nodes).toEqual([
      { id: 1, pieces },
      { id: 2, pieces },
    ]);
    expect(state.editor.nodePositions).toEqual([
      { id: 1, x: 10, y: 20 },
      { id: 2, x: 100, y: 200 },
    ]);
    state = reducer(state, {
      type: "addNode",
      payload: { pieces, x: 20, y: 10 },
    });
    expect(state.editor.nodes).toEqual([
      { id: 1, pieces },
      { id: 2, pieces },
      { id: 3, pieces },
    ]);
    expect(state.editor.nodePositions).toEqual([
      { id: 1, x: 10, y: 20 },
      { id: 2, x: 100, y: 200 },
      { id: 3, x: 20, y: 10 },
    ]);
    state = reducer(state, {
      type: "addNode",
      payload: { pieces, x: 200, y: 100 },
    });
    expect(state.editor.nodes).toEqual([
      { id: 1, pieces },
      { id: 2, pieces },
      { id: 3, pieces },
      { id: 4, pieces },
    ]);
    expect(state.editor.nodePositions).toEqual([
      { id: 1, x: 10, y: 20 },
      { id: 2, x: 100, y: 200 },
      { id: 3, x: 20, y: 10 },
      { id: 4, x: 200, y: 100 },
    ]);
  });

  it("should handle addEdge", () => {
    const edge1 = {
      childNodeId: 2,
      parentNodeId: 1,
      parentPieceId: 1,
      type: "",
    };
    state = reducer(state, { type: "addEdge", payload: { edge: edge1 } });
    expect(state.editor.edges).toEqual([{ id: 1, ...edge1 }]);
    const edge2 = {
      childNodeId: 3,
      parentNodeId: 2,
      parentPieceId: 1,
      type: "",
    };
    state = reducer(state, { type: "addEdge", payload: { edge: edge2 } });
    expect(state.editor.edges).toEqual([
      { id: 1, ...edge1 },
      { id: 2, ...edge2 },
    ]);
    const edge3 = {
      childNodeId: 4,
      parentNodeId: 3,
      parentPieceId: 1,
      type: "",
    };
    state = reducer(state, { type: "addEdge", payload: { edge: edge3 } });
    expect(state.editor.edges).toEqual([
      { id: 1, ...edge1 },
      { id: 2, ...edge2 },
      { id: 3, ...edge3 },
    ]);
  });

  it("should handle selectNode, clearNodeSelection", () => {
    state = reducer(state, {
      type: "selectNode",
      payload: { selectedNode: { id: 2 } },
    });
    expect(state.editor.selectedNode.id).toEqual(2);
    state = reducer(state, {
      type: "clearNodeSelection",
    });
    expect(state.editor.selectedNode).toEqual(null);
  });

  it("should handle selectEdge, clearEdgeSelection", () => {
    state = reducer(state, {
      type: "selectEdge",
      payload: { selectedEdge: { id: 1 } },
    });
    expect(state.editor.selectedEdge.id).toEqual(1);
    state = reducer(state, {
      type: "clearEdgeSelection",
    });
    expect(state.editor.selectedEdge).toEqual(null);
  });

  it("should handle moveNodeTo", () => {
    state = reducer(state, {
      type: "moveNodeTo",
      payload: { nodeId: 3, x: 30, y: 40 },
    });
    expect(state.editor.nodePositions).toEqual([
      { id: 1, x: 10, y: 20 },
      { id: 2, x: 100, y: 200 },
      { id: 3, x: 30, y: 40 },
      { id: 4, x: 200, y: 100 },
    ]);
    state = reducer(state, {
      type: "moveNodeTo",
      payload: { nodeId: 1, x: 40, y: 30 },
    });
    expect(state.editor.nodePositions).toEqual([
      { id: 1, x: 40, y: 30 },
      { id: 2, x: 100, y: 200 },
      { id: 3, x: 30, y: 40 },
      { id: 4, x: 200, y: 100 },
    ]);
  });

  it("should handle setDragEdge, clearDragEdge", () => {
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
      type: "setDragEdge",
      payload: { dragEdge: dragEdge1 },
    });
    expect(state.editor.dragEdge).toEqual({ ...dragEdge1 });
    state = reducer(state, { type: "clearDragEdge" });
    expect(state.editor.dragEdge).toEqual(null);
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
      type: "setDragEdge",
      payload: { dragEdge: dragEdge2 },
    });
    expect(state.editor.dragEdge).toEqual({ ...dragEdge2 });
  });

  it("should handle moveDragEdgeParentEndTo", () => {
    state = reducer(state, {
      type: "moveDragEdgeParentEndTo",
      payload: { x: 10, y: 20 },
    });
    expect(state.editor.dragEdge.parentX).toEqual(10);
    expect(state.editor.dragEdge.parentY).toEqual(20);
    state = reducer(state, {
      type: "moveDragEdgeParentEndTo",
      payload: { x: 100, y: 200 },
    });
    expect(state.editor.dragEdge.parentX).toEqual(100);
    expect(state.editor.dragEdge.parentY).toEqual(200);
  });

  it("should handle moveDragEdgeChildEndTo", () => {
    state = reducer(state, {
      type: "moveDragEdgeChildEndTo",
      payload: { x: 10, y: 20 },
    });
    expect(state.editor.dragEdge.childX).toEqual(10);
    expect(state.editor.dragEdge.childY).toEqual(20);
    state = reducer(state, {
      type: "moveDragEdgeChildEndTo",
      payload: { x: 100, y: 200 },
    });
    expect(state.editor.dragEdge.childX).toEqual(100);
    expect(state.editor.dragEdge.childY).toEqual(200);
  });

  it("should handle removeEdge", () => {
    state = reducer(state, { type: "removeEdge", payload: { edgeId: 3 } });
    expect(state.editor.edges).toEqual([
      { id: 1, childNodeId: 2, parentNodeId: 1, parentPieceId: 1, type: "" },
      { id: 2, childNodeId: 3, parentNodeId: 2, parentPieceId: 1, type: "" },
    ]);
  });

  it("should handle removeNode", () => {
    state = reducer(state, { type: "removeNode", payload: { nodeId: 2 } });
    expect(state.editor.nodes).toEqual([
      { id: 1, pieces: ["a", null, "b"] },
      { id: 3, pieces: ["a", null, "b"] },
      { id: 4, pieces: ["a", null, "b"] },
    ]);
    expect(state.editor.nodePositions).toEqual([
      { id: 1, x: 40, y: 30 },
      { id: 3, x: 30, y: 40 },
      { id: 4, x: 200, y: 100 },
    ]);
    expect(state.editor.edges).toEqual([]);
  });
});
