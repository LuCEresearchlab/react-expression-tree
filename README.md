Example:

```
  <ExpressionTreeEditor 
  width={1000}
  height={700}
  allowedErrors={{
    loop: true,
    multiEdgeOnHoleConnector: true,
    multiEdgeOnNodeConnector: true,
  }}
  reportedErrors={{
    structureErrors: {
      loop: true,
      multiEdgeOnHoleConnector: true,
      multiEdgeOnNodeConnector: true,
    },
    completenessErrors: {
      emptyPieceConnector: true,
      missingNodeType: true,
      missingNodeValue: true,
    },
  }}
  connectorPlaceholder="{{}}"
  nodeTypes={[
    {
      type: 'String',
      any: true,
      fixedValues: ['"Hello"', '"World!"', '" "', '"Hello World!"'],
    },
    { type: 'Number', any: true },
    { type: 'Boolean', any: false, fixedValues: ['true', 'false'] },
    {
      type: 'Object',
      any: true,
      fixedValues: [],
    },
    { type: 'Undefined', any: false, fixedValues: ['undefined'] },
    { type: 'Null', any: false, fixedValues: ['null'] },
  ]}
  initialState={{
    initialNodes: [],
    initialEdges: [],
  }}
/>
```