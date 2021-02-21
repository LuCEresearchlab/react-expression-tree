Example with initial state and final nodes:

```js
<ExpressionTreeEditor
  height={700}
  toolbarButtons={{
    drawerButton: true,
    reset: true,
    undo: true,
    redo: true,
    reorder: true,
    validate: true,
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
    nodes: [
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
        isFinal: false,
      },
    ],
    edges: [],
  }}
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
  initialState={{}}
/>
```

Example with external context

```jsx
import ActivityStateManager from '../../../tests/components/ActivityStateManager';
import actions from '../../store/actions/index';
import { reducers } from '../../store/reducers/index';
import defaultState from '../../store/initialState';
import context from '../../../tests/components/ActivityStateContext';

;
<ActivityStateManager
  actions={actions}
  reducers={reducers}
  defaultState={defaultState}
>
  <ExpressionTreeEditor
    height={700}
    context={context}
  />
</ActivityStateManager>
```
