Example:

```js
<ExpressionTreeEditor 
  width={1000}
  height={700}
  fontSize={24}
  fontFamily="Ubuntu Mono, Courier"
  errorColor="#ff2f2f"
  nodeColor="#208020"
  selectedNodeColor="#3f51b5"
  finalNodeColor="#208080"
  rootConnectorColor="black"
  nodeConnectorColor="black"
  nodeHoleColor="#104010"
  nodeTagColor="#3f51b5"
  nodeTextColor="white"
  nodeDeleteButtonColor="red"
  edgeColor="black"
  edgeChildConnectorColor="#00c0c3"
  edgeParentConnectorColor="#c33100"
  selectedEdgeColor="#3f51b5"
  draggingEdgeColor="#f0f0f0"
  dragEdgeColor="black"
  dragEdgeChildConnectorColor="#00c0c3"
  dragEdgeParentConnectorColor="#c33100"
  selectionRectColor="rgba(0, 0, 255, 0.2)"
  toolbarPrimaryColor="#3f51b5"
  toolbarSecondaryColor="#f50057"
  toolbarButtons={{
    drawerButton: true,
    reset: true,
    undo: true,
    redo: true,
    reorder: true,
    validate: true,
    download: true,
    upload: true,
    screenshot: true,
    zoomIn: true,
    zoomOut: true,
    info: true,
    zoomToFit: true,
    fullScreen: true,
  }}
  drawerFields={{ addField: true, editField: true }}
  fullDisabled={false}
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
  templateNodes={[
    '{{}}?{{}}:{{}}',
    '{{}}[{{}}]',
    '{{}}.{{}}',
    '{{}}.length',
    '-{{}}',
    '{{}}+{{}}',
    '{{}}-{{}}',
    '{{}}*{{}}',
    '{{}}/{{}}',
    '{{}}>{{}}',
    '{{}}<{{}}',
    '{{}}>={{}}',
    '{{}}<={{}}',
  ]}
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
    initialNodes: [
      {
        pieces: ['{{}}', '+', '{{}}'],
        x: 320,
        y: 90,
        type: '',
        value: '',
        isFinal: true,
      },
      {
        pieces: ['1'],
        x: 410,
        y: 90,
        type: '',
        value: '',
        isFinal: true,
      },
      {
        pieces: ['3'],
        x: 460,
        y: 90,
        type: '',
        value: '',
        isFinal: true,
      },
    ],
    initialEdges: [],
  }}
/>
```

```js
<ExpressionTreeEditor 
  width={1000}
  height={700}
  fontSize={24}
  drawerFields={{ addField: true, editField: true }}
  fullDisabled={false}
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
