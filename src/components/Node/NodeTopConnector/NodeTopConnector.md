Normal Node:

```jsx
import { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import useContainerWidthOnWindowResize from '../../../hooks/useContainerWidthOnWindowResize';

const containerRef = useRef();
const width = useContainerWidthOnWindowResize(containerRef);
const height = 25;

;<div
  ref={containerRef}
>
  <Stage
    width={width}
    height={height}
    offsetY={-15}
  >
    <Layer>
      <NodeTopConnector
        nodeId={1}
        nodeWidth={50}
      />
    </Layer>
  </Stage>
</div>
```

Root Node:

```jsx
import { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import useContainerWidthOnWindowResize from '../../../hooks/useContainerWidthOnWindowResize';

const containerRef = useRef();
const width = useContainerWidthOnWindowResize(containerRef);
const height = 25;

;<div
  ref={containerRef}
>
  <Stage
    width={width}
    height={height}
    offsetY={-15}
  >
    <Layer>
      <NodeTopConnector
        nodeId={1}
        nodeWidth={50}
        isSelectedRoot={true}
      />
    </Layer>
  </Stage>
</div>
```