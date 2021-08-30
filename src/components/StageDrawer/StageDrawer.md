```jsx
import { useRef } from 'react';
import useContainerWidthOnWindowResize from '../../hooks/useContainerWidthOnWindowResize';

const containerRef = useRef();
const width = useContainerWidthOnWindowResize(containerRef);
const height = 600;

;
<div
  ref={containerRef}
  style={{height: `${height}px`, backgroundColor: 'black', position: 'relative',}}
>
  <StageDrawer
    containerRef={containerRef}
    toolbarButtons={{
      drawerButton: true,
      reset: true,
      undo: true,
      redo: true,
      reorder: true,
      upload: true,
      screenshot: true,
      zoomIn: true,
      zoomOut: true,
      info: true,
      zoomToFit: true,
      fullScreen: true,
    }}
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
    connectorPlaceholder={"{{}}"}
    addingNode={true}
  />
</div>
```