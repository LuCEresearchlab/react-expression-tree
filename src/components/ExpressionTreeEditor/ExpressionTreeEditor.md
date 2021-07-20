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
      "isFinal": true,
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
  highlightedNodes={['n4', 'n5', 'does not exist', 'n6']}
  highlightedEdges={['e0', 'e1', 'e2']}
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

```jsx
const data = [{"diagram":{"nodes":{"n16":{"pieces":["\"!\""],"type":"String"},"n1":{"pieces":["#","+","#"],"type":"String"},"n2":{"pieces":["#","?","#",":","#"],"type":"String"},"n9":{"pieces":["\"Hi\""],"type":"String"},"n17":{"pieces":["\"\""],"type":"String"},"n4":{"pieces":["Character"],"type":"Character"},"n8":{"pieces":["\"Hello\""],"type":"String"},"n3":{"pieces":["#",".","isUpperCase","(","#",")"],"type":"boolean"},"n10":{"pieces":["\" \""],"type":"String"},"n14":{"pieces":["#","?","#",":","#"],"type":"String"},"n13":{"pieces":["#","+","#"],"type":"String"},"n5":{"pieces":["#",".","charAt","(","#",")"],"type":"char"},"n6":{"pieces":["name"],"type":"String"},"n11":{"pieces":["#","+","#"],"type":"String"},"n15":{"pieces":["isHappy"],"type":"boolean"},"n7":{"pieces":["0"],"type":"int"},"n12":{"pieces":["name"],"type":"String"}},"edges":{"e0":{"parentNodeId":"n1","childNodeId":"n2","parentPieceId":0},"e1":{"parentNodeId":"n5","childNodeId":"n6","parentPieceId":0},"e2":{"parentNodeId":"n3","childNodeId":"n4","parentPieceId":0},"e3":{"parentNodeId":"n14","childNodeId":"n15","parentPieceId":0},"e4":{"parentNodeId":"n2","childNodeId":"n3","parentPieceId":0},"e5":{"parentNodeId":"n13","childNodeId":"n14","parentPieceId":2},"e6":{"parentNodeId":"n11","childNodeId":"n10","parentPieceId":0},"e7":{"parentNodeId":"n13","childNodeId":"n12","parentPieceId":0},"e8":{"parentNodeId":"n11","childNodeId":"n13","parentPieceId":2},"e9":{"parentNodeId":"n3","childNodeId":"n5","parentPieceId":4},"e10":{"parentNodeId":"n5","childNodeId":"n7","parentPieceId":4},"e11":{"parentNodeId":"n14","childNodeId":"n16","parentPieceId":2},"e12":{"parentNodeId":"n14","childNodeId":"n17","parentPieceId":4},"e13":{"parentNodeId":"n2","childNodeId":"n8","parentPieceId":2},"e14":{"parentNodeId":"n2","childNodeId":"n9","parentPieceId":4},"e15":{"parentNodeId":"n1","childNodeId":"n11","parentPieceId":2}},"selectedRootNode":"n1"},"typingMap":{"Character":"Character","isHappy":"boolean","name":"String"},"code":"(Character.isUpperCase(name.charAt(0)) ? \"Hello\" : \"Hi\")\n                + \" \"\n                + name\n                + (isHappy ? \"!\" : \"\")","location":{"first":188,"last":328}},{"diagram":{"nodes":{"n41":{"pieces":["x"],"type":"Boolean"},"n42":{"pieces":["!","#"],"type":"Boolean"},"n40":{"pieces":["(","#",") ->","#"],"type":"Function<Boolean,Boolean>"},"n43":{"pieces":["x"],"type":"Boolean"}},"edges":{"e0":{"parentNodeId":"n40","childNodeId":"n42","parentPieceId":3},"e1":{"parentNodeId":"n40","childNodeId":"n41","parentPieceId":1},"e2":{"parentNodeId":"n42","childNodeId":"n43","parentPieceId":1}},"selectedRootNode":"n40"},"typingMap":{"x":"Boolean"},"code":"(x) -> !x","location":{"first":578,"last":587}},{"diagram":{"nodes":{"n38":{"pieces":["a"],"type":"double"},"n21":{"pieces":["b"],"type":"double"},"n33":{"pieces":["a"],"type":"double"},"n27":{"pieces":["#",".","pow","(","#",",","#",")"],"type":"double"},"n36":{"pieces":["#","*","#"],"type":"double"},"n30":{"pieces":["2.0"],"type":"double"},"n26":{"pieces":["#","-","#"],"type":"double"},"n28":{"pieces":["Math"],"type":"Math"},"n32":{"pieces":["4.0"],"type":"double"},"n25":{"pieces":["Math"],"type":"Math"},"n20":{"pieces":["#","*","#"],"type":"double"},"n31":{"pieces":["#","*","#"],"type":"double"},"n18":{"pieces":["#","/","#"],"type":"double"},"n24":{"pieces":["#",".","sqrt","(","#",")"],"type":"double"},"n29":{"pieces":["b"],"type":"double"},"n35":{"pieces":["c"],"type":"double"},"n34":{"pieces":["#","*","#"],"type":"double"},"n19":{"pieces":["#","+","#"],"type":"double"},"n37":{"pieces":["2.0"],"type":"double"},"n22":{"pieces":["-","#"],"type":"double"},"n23":{"pieces":["1.0"],"type":"double"}},"edges":{"e0":{"parentNodeId":"n36","childNodeId":"n38","parentPieceId":2},"e1":{"parentNodeId":"n18","childNodeId":"n36","parentPieceId":2},"e2":{"parentNodeId":"n19","childNodeId":"n20","parentPieceId":0},"e3":{"parentNodeId":"n24","childNodeId":"n25","parentPieceId":0},"e4":{"parentNodeId":"n27","childNodeId":"n29","parentPieceId":4},"e5":{"parentNodeId":"n31","childNodeId":"n34","parentPieceId":2},"e6":{"parentNodeId":"n19","childNodeId":"n24","parentPieceId":2},"e7":{"parentNodeId":"n20","childNodeId":"n21","parentPieceId":0},"e8":{"parentNodeId":"n34","childNodeId":"n35","parentPieceId":2},"e9":{"parentNodeId":"n31","childNodeId":"n32","parentPieceId":0},"e10":{"parentNodeId":"n26","childNodeId":"n27","parentPieceId":0},"e11":{"parentNodeId":"n36","childNodeId":"n37","parentPieceId":0},"e12":{"parentNodeId":"n24","childNodeId":"n26","parentPieceId":4},"e13":{"parentNodeId":"n27","childNodeId":"n30","parentPieceId":6},"e14":{"parentNodeId":"n26","childNodeId":"n31","parentPieceId":2},"e15":{"parentNodeId":"n34","childNodeId":"n33","parentPieceId":0},"e16":{"parentNodeId":"n27","childNodeId":"n28","parentPieceId":0},"e17":{"parentNodeId":"n22","childNodeId":"n23","parentPieceId":1},"e18":{"parentNodeId":"n20","childNodeId":"n22","parentPieceId":2},"e19":{"parentNodeId":"n18","childNodeId":"n19","parentPieceId":0}},"selectedRootNode":"n18"},"typingMap":{"a":"double","b":"double","c":"double","Math":"Math"},"code":"((b * -1.0) + Math.sqrt(Math.pow(b, 2.0) - (4.0 * a * c))) / (2.0 * a)","location":{"first":408,"last":478}},{"diagram":{"nodes":{"n47":{"pieces":["isHappy"],"type":"boolean"},"n45":{"pieces":["#",".","apply","(","#",")"],"type":"Boolean"},"n46":{"pieces":["inv"],"type":"Function<Boolean,Boolean>"}},"edges":{"e0":{"parentNodeId":"n45","childNodeId":"n47","parentPieceId":4},"e1":{"parentNodeId":"n45","childNodeId":"n46","parentPieceId":0}},"selectedRootNode":"n45"},"typingMap":{"inv":"Function<Boolean,Boolean>","isHappy":"boolean"},"code":"inv.apply(isHappy)","location":{"first":607,"last":625}}];
const i = 0;
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
  ]}
  allowFreeTypeUpdate={true}
  allowFreeValueUpdate={true}
  templateNodeTypesAndValues={{
  }}
  nodes={data[i].diagram.nodes}
  edges={data[i].diagram.edges}
  stageScale={{x: 1.2, y: 1.2}}
  stagePos={{x:40, y: 200}}
  selectedRootNode={data[i].diagram.selectedRootNode}
/>
```
