Normal Edge:

```jsx
import { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import useContainerWidthOnWindowResize from '../../hooks/useContainerWidthOnWindowResize';

const containerRef = useRef();
const width = useContainerWidthOnWindowResize(containerRef);
const height = 50;

;<div
  ref={containerRef}
>
  <Stage
    width={width}
    height={height}
  >
    <Layer>
      <Edge
        id={1}
        childX={25}
        childY={25}
        childNodeId={0}
        childWidth={0}
        parentX={100}
        parentY={0}
        parentNodeId={0}
        parentPieceId={0}
        parentPieceX={0}
        placeholderWidth={24}
      />
    </Layer>
  </Stage>
</div>
```

Selected Edge:

```jsx
import { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import useContainerWidthOnWindowResize from '../../hooks/useContainerWidthOnWindowResize';

const containerRef = useRef();
const width = useContainerWidthOnWindowResize(containerRef);
const height = 50;

;<div
  ref={containerRef}
>
  <Stage
    width={width}
    height={height}
  >
    <Layer>
      <Edge
        id={1}
        childX={25}
        childY={25}
        childNodeId={0}
        childWidth={0}
        parentX={100}
        parentY={0}
        parentNodeId={0}
        parentPieceId={0}
        parentPieceX={0}
        placeholderWidth={24}
        isSelected={true}
      />
    </Layer>
  </Stage>
</div>
```