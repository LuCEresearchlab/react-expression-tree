```jsx
import { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer, Rect } from 'react-konva';
import createPositionUtils from '../../../utils/position';
import useContainerWidthOnWindowResize from '../../../hooks/useContainerWidthOnWindowResize';

const { 
  computeLabelPiecesXCoordinatePositions,
} = createPositionUtils(24, "Roboto Mono, Courier", "{{}}", 24)

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
      
      <NodeLabel
        nodeId={1}
        connectorPlaceholder={"{{}}"}
        labelPieces={labelPieces}
        labelPiecesPosition={computeLabelPiecesXCoordinatePositions(labelPieces)}
        nodeHeight={50}
      />
    </Layer>
  </Stage>
</div>
```