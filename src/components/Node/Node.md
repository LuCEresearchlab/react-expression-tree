```jsx
import { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import createPositionUtils from '../../utils/position';
import useContainerWidthOnWindowResize from '../../hooks/useContainerWidthOnWindowResize';
import defaultStyle from '../../style/default.json'

const { 
  computeNodeWidth,
  computeLabelPiecesXCoordinatePositions,
} = createPositionUtils(24, defaultStyle.fontFamily, "{{}}", 24)

const containerRef = useRef();
const width = useContainerWidthOnWindowResize(containerRef);
const height = 120;
const labelPieces = ["Hello ", "{{}}", "World"];

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
        positionX={25}
        positionY={50}
        typeText={"String"}
        valueText={"\"Test\""}
        connectorPlaceholder={"{{}}"}
        placeholderWidth={20}
        stageWidth={width}
        stageHeight={height}
        nodeWidth={computeNodeWidth(labelPieces)}
        computeLabelPiecesXCoordinatePositions={computeLabelPiecesXCoordinatePositions}
        isFullDisabled={true}
      />
    </Layer>
  </Stage>
</div>
```