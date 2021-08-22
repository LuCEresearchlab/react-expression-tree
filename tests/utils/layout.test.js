/* global describe, it, expect */

import {
  isHolePiece,
  getSortedChildIds,
  isRootId,
  isSingletonId,
} from '../../src/utils/layout';

// test data
const hole = '{{}}';
const exampleNodes = {
  n0: {
    pieces: ['#', '+', '#'],
    type: 'Number',
    value: '10',
    isFinal: true,
    x: 320,
    y: 90,
  },
  n1: {
    pieces: ['#', '-', '#'],
    type: 'Boolean',
    value: 'true',
    isFinal: false,
    x: 320,
    y: 120,
  },
  n2: {
    pieces: ['#', '/', '#'],
    type: 'Object',
    value: '',
    isFinal: false,
    x: 320,
    y: 150,
  },
};
const exampleEdges = {
  e0: {
    parentNodeId: 'n0',
    parentPieceId: 0,
    childNodeId: 'n1',
  },
  e1: {
    parentNodeId: 'n0',
    parentPieceId: 2,
    childNodeId: 'n2',
  },
};

// tests of structural functions
describe('isHolePiece', () => {
  it('should identify {{}} as hole', () => {
    expect(isHolePiece('{{}}')).toBe(true);
  });
  it('should identify # as non-hole', () => {
    expect(isHolePiece('#')).toBe(false);
  });
  it('should identify {} as non-hole', () => {
    expect(isHolePiece('{}')).toBe(false);
  });
});

describe('getSortedChildIds', () => {
  it('should return empty array when no edges', () => {
    const nodes = {};
    const edges = {};
    expect(getSortedChildIds('n0', nodes, edges)).toStrictEqual([]);
  });
  it('should return empty array when no edges', () => {
    const nodes = {
      node: { pieces: [hole, '+', hole] },
    };
    const edges = {};
    expect(getSortedChildIds('node', nodes, edges)).toStrictEqual([]);
  });
  it('should work for one child', () => {
    const myNodes = {
      parent: { pieces: [hole] },
      child: { pieces: [hole] },
    };
    const myEdges = {
      e0: {
        parentNodeId: 'parent',
        parentPieceId: 0,
        childNodeId: 'child',
      },
    };
    expect(getSortedChildIds('parent', myNodes, myEdges)).toStrictEqual(['child']);
  });
  it('should work for two children', () => {
    const myNodes = {
      parent: { pieces: [hole, hole] },
      child0: { pieces: [hole] },
      child1: { pieces: [hole] },
    };
    const myEdges = {
      e0: {
        parentNodeId: 'parent',
        parentPieceId: 0,
        childNodeId: 'child0',
      },
      e1: {
        parentNodeId: 'parent',
        parentPieceId: 1,
        childNodeId: 'child1',
      },
    };
    expect(getSortedChildIds('parent', myNodes, myEdges)).toStrictEqual(['child0', 'child1']);
  });
});

describe('isRootId', () => {
  it('should be true if not a node', () => {
    const nodes = {};
    const edges = {};
    expect(isRootId('n0', nodes, edges)).toBe(true);
  });
  it('should be true for singleton node', () => {
    const nodes = {
      node: { pieces: ['a'] },
    };
    const edges = {};
    expect(isRootId('node', nodes, edges)).toBe(true);
  });
  it('should be true for root with child', () => {
    const nodes = {
      parent: { pieces: [hole] },
      child: { pieces: ['a'] },
    };
    const edges = {
      e0: {
        parentNodeId: 'parent',
        parentPieceId: 0,
        childNodeId: 'child',
      },
    };
    expect(isRootId('parent', nodes, edges)).toBe(true);
  });
  it('should be false for child', () => {
    const nodes = {
      parent: { pieces: [hole] },
      child: { pieces: ['a'] },
    };
    const edges = {
      e0: {
        parentNodeId: 'parent',
        parentPieceId: 0,
        childNodeId: 'child',
      },
    };
    expect(isRootId('child', nodes, edges)).toBe(false);
  });
});

describe('isSingletonId', () => {
  it('should be true if not a node', () => {
    const nodes = {};
    const edges = {};
    expect(isSingletonId('n0', nodes, edges)).toBe(true);
  });
  it('should be true for singleton node', () => {
    const nodes = {
      node: { pieces: ['a'] },
    };
    const edges = {};
    expect(isSingletonId('node', nodes, edges)).toBe(true);
  });
  it('should be false for root with child', () => {
    const nodes = {
      parent: { pieces: [hole] },
      child: { pieces: ['a'] },
    };
    const edges = {
      e0: {
        parentNodeId: 'parent',
        parentPieceId: 0,
        childNodeId: 'child',
      },
    };
    expect(isSingletonId('parent', nodes, edges)).toBe(false);
  });
  it('should be false for child', () => {
    const nodes = {
      parent: { pieces: [hole] },
      child: { pieces: ['a'] },
    };
    const edges = {
      e0: {
        parentNodeId: 'parent',
        parentPieceId: 0,
        childNodeId: 'child',
      },
    };
    expect(isSingletonId('child', nodes, edges)).toBe(false);
  });
});

/*
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
*/
