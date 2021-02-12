```jsx
import { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer, Rect } from 'react-konva';
import useContainerWidthOnWindowResize from '../../../hooks/useContainerWidthOnWindowResize';

const containerRef = useRef();
const width = useContainerWidthOnWindowResize(containerRef);
const height = 50;
const labelPieces = ["Hello ", "{{}}", "World"];

;<div
  ref={containerRef}
>
  <Stage
    width={width}
    height={height}
  >
    <Layer>
      <Rect 
        x={0}
        y={0}
        width={width}
        height={height}
        fill={"black"}
      />
      
      <NodeDeleteButton
        nodeId={1}
        nodeWidth={50}
      />
    </Layer>
  </Stage>
</div>
```