Example with initial object state and final nodes:

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
    showUndoButton: true,
    showRedoButton: true,
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
  allowedErrors={{
    loop: true,
    multiEdgeOnHoleConnector: true,
    multiEdgeOnNodeConnector: true,
  }}
  connectorPlaceholder="#"
  templateNodes={[
    '#?#:#',
    '#[#]',
  ]}
  allowFreeTypeUpdate={true}
  allowFreeValueUpdate={true}
  templateNodeTypesAndValues={{
    String: ['"Hello"', '"World!"', '" "', '"Hello World!"'],
    Number: ['1', '2'],
    Boolean: ['true', 'false'],
    Object: [],
    Undefined: ['undefined'],
    Null: ['null'],
  }}
  nodes={{
    "n0": {
      "pieces": ["#", "+", "#"],
      "x": 320,
      "y": 90,
      "type": "Number",
      "value": "10",
      "isFinal": false,
    },
    "n1": {
      "pieces": ["#", "-", "#"],
      "x": 320,
      "y": 120,
      "type": "Boolean",
      "value": "true",
      "isFinal": false,
    },
    "n2": {
      "pieces": ["#", "/", "#"],
      "x": 320,
      "y": 150,
      "type": "Object",
      "value": "",
      "isFinal": false,
    },
    "n3": {
      "pieces": ["1"],
      "x": 320,
      "y": 190,
      "type": "",
      "value": "",
      "isFinal": false,
    },
    "n4": {
      "pieces": ["2"],
      "x": 320,
      "y": 190,
      "type": "",
      "value": "",
      "isFinal": false,
    },
    "n5": {
      "pieces": ["3"],
      "x": 460,
      "y": 230,
      "type": "",
      "value": "",
      "isFinal": false,
    },
    "n6": {
      "pieces": ["#", "+", "#"],
      "x": 320,
      "y": 190,
      "type": "",
      "value": "",
      "isFinal": false,
    },
    "n7": {
      "pieces": ["5"],
      "x": 520,
      "y": 190,
      "type": "",
      "value": "Not connected",
    },
    "n8": {
      "pieces": ["6"],
      "x": 520,
      "y": 190,
      "type": "",
      "value": "Not connected",
    },
    "n9": {
      "pieces": ["7"],
      "x": 520,
      "y": 190,
      "type": "",
      "value": "Not connected",
    },
  }}
  edges={{
    "e0": {
      parentNodeId: "n0",
      childNodeId: "n1",
      parentPieceId: 0,
    },
    "e1": {
      parentNodeId: "n0",
      childNodeId: "n2",
      parentPieceId: 2,
    },
    "e2": {
      parentNodeId: "n1",
      childNodeId: "n3",
      parentPieceId: 0,
    },
    "e3": {
      parentNodeId: "n1",
      childNodeId: "n4",
      parentPieceId: 2,
    },
    "e4": {
      parentNodeId: "n2",
      childNodeId: "n5",
      parentPieceId: 0,
    },
    "e5": {
      parentNodeId: "n2",
      childNodeId: "n6",
      parentPieceId: 2,
    },
  }}
  stageScale={{x: 1.2, y: 1.2}}
  stagePos={{x:40, y: 200}}
  selectedRootNode={'n0'}
  selectedNode={'n2'}
/>
```

Example with initial array state:

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
    showUndoButton: true,
    showRedoButton: true,
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
  allowedErrors={{
    loop: true,
    multiEdgeOnHoleConnector: true,
    multiEdgeOnNodeConnector: true,
  }}
  connectorPlaceholder="#"
  templateNodes={[
    '#?#:#',
    '#[#]',
  ]}
  allowFreeTypeUpdate={true}
  allowFreeValueUpdate={true}
  templateNodeTypesAndValues={{
    String: ['"Hello"', '"World!"', '" "', '"Hello World!"'],
    Number: ['1', '2'],
    Boolean: ['true', 'false'],
    Object: [],
    Undefined: ['undefined'],
    Null: ['null'],
  }}
  nodes={[
    {
    "id": 1,
    "pieces": ["1"],
    "x": 424.597500066782,
    "y": 299,
    "width": 38.40234375,
    "type": "",
    "value": "",
    "isFinal": false
    },
    {
    "id": 2,
    "pieces": ["2"],
    "x": 553.9999470992326,
    "y": 300,
    "width": 38.40234375,
    "type": "",
    "value": "",
    "isFinal": false
    },
    {
    "id": 3,
    "pieces": ["3"],
    "x": 600.5999999999999,
    "y": 200,
    "width": 38.40234375,
    "type": "",
    "value": "",
    "isFinal": false
    },
    {
    "id": 4,
    "pieces": ["", "#", "+", "#", ""],
    "x": 460.99765625,
    "y": 200,
    "width": 89.60234375,
    "type": "",
    "value": "",
    "isFinal": false
    },
    {
    "id": 5,
    "pieces": ["", "#", "+", "#", ""],
    "x": 503.65468061056725,
    "y": 84.77273559570312,
    "width": 89.60234375,
    "type": "",
    "value": "",
    "isFinal": false
    }
  ]}
  edges={[
    {
      "parentNodeId": 4,
      "parentPieceId": 1,
      "childNodeId": 1,
      "id": 5
    },
    {
      "parentNodeId": 4,
      "parentPieceId": 3,
      "childNodeId": 2,
      "id": 6
    },
    {
      "parentNodeId": 5,
      "parentPieceId": 1,
      "childNodeId": 4,
      "id": 7
    },
    {
      "parentNodeId": 5,
      "parentPieceId": 3,
      "childNodeId": 3,
      "id": 8
    }
  ]}
  stageScale={{x: 1.2, y: 1.2}}
  stagePos={{x:40, y: 200}}
/>
```

Example without initial state:

```js
<ExpressionTreeEditor 
  height={700}
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
  connectorPlaceholder="#"
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
