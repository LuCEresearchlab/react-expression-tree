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
import axios from 'axios';
import { useState } from 'react';

import { 
  Box, Button, Grid, Paper, TextField, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography,
} from '@material-ui/core';
import {
  Alert
} from '@material-ui/lab';

import { 
  ET_BASE_URL,
  ET_PARSE_URL,
  EXPR_TREE_EXAMPLE_CODE
} from '../../../tests/config';

const emptyData = [{
  'diagram': {},
  'typingMap': {},
  'location': { 'start': '0', 'end': '0' },
}];
const [data, setData] = useState(emptyData);
const [dataIndex, setDataIndex] = useState(0);
const [sourceCode, setSourceCode] = useState(EXPR_TREE_EXAMPLE_CODE);

const [alert, setAlert] = useState({
  'message': `The source code will be sent to the Expression Tutor backend (at
      ${ET_BASE_URL}), which in turn talks to the Expression Service server.\n
      Ensure both servers are up and running in order for this functionality
      to work.\n
      Refer to the documentation for further information.`,
  'status': 'info',
});

const getContextualizedExprView = (text, range) => {
  if (range.start === range.end) {
    return;
  }
  let i = range.start;
  while (i >= 0) {
    if (text.charAt(i) === '\n') {
      break;
    }
    i--;
  }
  const lastNewLine = i;
  i = range.end;
  while (i < text.length) {
    if (text.charAt(i) === '\n') {
      break;
    }
    i++;
  }
  return (
    <Paper
      style={{ 'padding': '16px' }}
      variant="outlined">
      <Typography
        style={{ 'fontFamily': 'monospace' }}>
        {text.substring(lastNewLine, range.start)}
        <Box style={{ 'background': '#fff4e5', 'display': 'inline' }}>
          {text.substring(range.start, range.end)}
        </Box>
        {text.substring(range.end, i)}
      </Typography>
    </Paper>
  );
}

const generateDiagrams = (e) => {
  e.preventDefault();

  // Ensure both Expression Tutor and
  // expression service servers are running
  // in order for this request to succeed.
  // If you wish to change the Expression Tutor
  // url, edit the "utils/config.js" file.
  axios.post(ET_PARSE_URL, { sourceCode })
    .then(res => {
      setDataIndex(0);
      if (res.data && res.data.length > 0) {
        setAlert({
          'message': '',
          'status': 'success',
        });
        setData(res.data);
      } else {
        setAlert({
          'message': 'No expression was found',
          'status': 'warning',
        });
        setData(emptyData);
      }
    })
    .catch(res => {
      console.error(res);
      setAlert({
        'message': `Failed to parse the source code.\n
        Make sure the  Expression Tutor server (at ${ET_BASE_URL}) and
        the Expression Service server are running and check their logs
        for further information about what went wrong.`,
        'status': 'error',
      });
    });
};

const viewNextExpression = () => {
  setDataIndex((dataIndex + 1) % data.length);
};

;
<Grid container spacing={2}>
  <Grid item xs={12}>
    <Typography variant="h4">Generate ET diagrams from Java source code</Typography>

    <form
      autoComplete="off"
      novalidate
      onSubmit={generateDiagrams}>

      <TextField
        style={{'fontFamily': 'monospace'}}
        defaultValue={sourceCode}
        onChange={(e) => setSourceCode(e.target.value)}
        margin="normal"
        placeholder="Java source code"
        maxRows={10}
        variant="outlined"
        fullWidth
        multiline />
    
      <Button
        color="primary"
        variant="contained"
        onClick={generateDiagrams}>Parse</Button>
    </form>
  </Grid>

  <Grid item xs={12}>
    { alert.status === 'success' ?
      (
      <Alert 
        action={
          <Button
            color='inherit'
            size='small'
            onClick={viewNextExpression}>
            Next expression
          </Button>
        }
        severity='success'>
        Viewing expression {dataIndex + 1} of {data.length}.
        Click the reorder node to properly see the diagram.
      </Alert>
      ) : (
        <Alert severity={alert.status}>{alert.message}</Alert>
      )
    }
  </Grid>

  <Grid item xs={6}>
    <Typography variant="h5">Code</Typography>
    {getContextualizedExprView(sourceCode, data[dataIndex].location)}
  </Grid>

  <Grid item xs={6}>
    <Typography variant="h5">Typing map</Typography>
    <TableContainer
      component={Paper}
      variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        { Object.keys(data[dataIndex].typingMap).map(name => (
          <TableRow key={`typing_map_${name}`}>
            <TableCell component="th" scope="row">{name}</TableCell>
            <TableCell>{data[dataIndex].typingMap[name]}</TableCell>
          </TableRow>
        ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Grid>

  <Grid item xs={12}>
    <ExpressionTreeEditor
      height={700}
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
        showTakeScreenshotButton: true,
        showFullScreenButton: true,
      }} 
      showDrawer={true}
      showDrawerSections={{
        templateDropdown: true,
        editLabelField: true,
        editTypeField: true,
        editValueField: true,
      }}
      connectorPlaceholder="#"
      nodes={data[dataIndex].diagram.nodes}
      edges={data[dataIndex].diagram.edges}
      stageScale={{x: 1.2, y: 1.2}}
      stagePos={{x:40, y: 200}}
      selectedRootNode={data[dataIndex].diagram.selectedRootNode} />
  </Grid>
</Grid>
```
