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
        childX={25}
        childY={25}
        parentX={100}
        parentY={25}
      />
    </Layer>
  </Stage>
</div>
```