Example with initial state and final nodes:

```js
<ExpressionTreeEditor
  height={700}
  reportErrorConfig={{
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
  isFullDisabled={false}
  showToolbar={true}
  showToolbarButtons={{
    showDrawerButton: true,
    showEditorInfoButton: true,
    showStateResetButton: true,
    showUndoButton: false,
    showRedoButton: false,
    showZoomOutButton: true,
    showZoomInButton: true,
    showZoomToFitButton: true,
    showReorderNodesButton: true,
    showValidateTreeButton: true,
    showUploadStateButton: true,
    showTakeScreenshotButton: true,
    showFullScreenButton: true,
  }} 
  showDrawer={true}
  showDrawerSections={{
    addNodeField: true,
    templateDropdown: true,
    editLabelField: true,
    editTypeField: true,
    editValueField: true,
  }}

  fullDisabled={false}
  allowedErrors={{
    loop: false,
    multiEdgeOnHoleConnector: false,
    multiEdgeOnNodeConnector: false,
  }}
  connectorPlaceholder="{{}}"
  templateNodes={[
    '{{}}?{{}}:{{}}',
    '{{}}[{{}}]',
  ]}
  allowFreeTypeEdit={true}
  allowFreeValueEdit={true}
  templateNodeTypesAndValues={{
    String: ['"Hello"', '"World!"', '" "', '"Hello World!"'],
    Number: ['1', '2'],
    Boolean: ['true', 'false'],
    Object: [],
    Undefined: ['undefiend'],
    Null: ['null'],
  }}
  nodes={[
    {
      id: 0,
      pieces: ['{{}}', '+', '{{}}'],
      x: 320,
      y: 90,
      type: 'Number',
      value: '10',
      isFinal: true,
    },
    {
      id: 1,
      pieces: ['{{}}', '-', '{{}}'],
      x: 320,
      y: 120,
      type: 'Boolean',
      value: 'true',
      isFinal: true,
    },
    {
      id: 2,
      pieces: ['{{}}', '/', '{{}}'],
      x: 320,
      y: 150,
      type: 'Object',
      value: '',
      isFinal: true,
    },
    {
      id: 3,
      pieces: ['1'],
      x: 320,
      y: 190,
      type: '',
      value: '',
      isFinal: true,
    },
    {
      id: 4,
      pieces: ['2'],
      x: 320,
      y: 190,
      type: '',
      value: '',
      isFinal: true,
    },
    {
      id: 5,
      pieces: ['3'],
      x: 460,
      y: 230,
      type: '',
      value: '',
      isFinal: false,
    },
    {
      id: 6,
      pieces: ['{{}}', '+', '{{}}'],
      x: 320,
      y: 190,
      type: '',
      value: '',
      isFinal: true,
    },
    {
      id: 7,
      pieces: ['5'],
      x: 520,
      y: 190,
      type: '',
      value: 'Not connected',
    },
    {
      id: 8,
      pieces: ['6'],
      x: 520,
      y: 190,
      type: '',
      value: 'Not connected',
    },
    {
      id: 9,
      pieces: ['7'],
      x: 520,
      y: 190,
      type: '',
      value: 'Not connected',
    },
  ]}
  edges={[{
      parentNodeId: 0,
      childNodeId: 1,
      parentPieceId: 0,
    },
    {
      parentNodeId: 0,
      childNodeId: 2,
      parentPieceId: 2,
    },
    {
      parentNodeId: 1,
      childNodeId: 3,
      parentPieceId: 0,
    },
    {
      parentNodeId: 1,
      childNodeId: 4,
      parentPieceId: 2,
    },
    {
      parentNodeId: 2,
      childNodeId: 5,
      parentPieceId: 0,
    },
    {
      parentNodeId: 2,
      childNodeId: 6,
      parentPieceId: 2,
    },
  ]}
  stageScale={{x: 1.2, y: 1.2}}
  stagePos={{x:40, y: 200}}
  selectedRootNode={0}
  // selectedNode={2}
  // selectedEdge={0}
/>
```

Example without initial state:

```js
<ExpressionTreeEditor 
  height={700}
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
/>
```
