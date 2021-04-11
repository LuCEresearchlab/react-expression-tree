```jsx
import { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import Node from '../Node';
import createPositionUtils from '../../../utils/position';
import useContainerWidthOnWindowResize from '../../../hooks/useContainerWidthOnWindowResize';

const { 
  computeNodeWidth,
  computeLabelPiecesXCoordinatePositions,
} = createPositionUtils(24, 'Roboto Mono, Courier', "{{}}", 20, 12, 12)

const containerRef = useRef();
const width = useContainerWidthOnWindowResize(containerRef);
const height = 70;
const labelPieces = ["Test"];
const labelPiecesPosition = computeLabelPiecesXCoordinatePositions(labelPieces)

;<div
  ref={containerRef}
>
  <Stage
    width={width}
    height={height}
  >
    <Layer>
      <Node
        id={1}
        labelPieces={labelPieces}
        labelPiecesPosition={labelPiecesPosition}
        positionX={25}
        positionY={10}
        connectorPlaceholder={"{{}}"}
        placeholderWidth={20}
        stageWidth={width}
        stageHeight={height}
        nodeWidth={computeNodeWidth(labelPieces)}
        nodeHeight={48}
        isSelected={true}
      />
    </Layer>
  </Stage>
</div>
```