```jsx
import { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import createPositionUtils from '../../utils/position';
import useContainerWidthOnWindowResize from '../../hooks/useContainerWidthOnWindowResize';

const { 
  computeNodeWidth,
  computeLabelPiecesXCoordinatePositions,
} = createPositionUtils(24, 'Roboto Mono, Courier', "{{}}", 20, 12, 12)

const containerRef = useRef();
const width = useContainerWidthOnWindowResize(containerRef);
const height = 120;
const labelPieces = ["Hello ", "{{}}", " World"];
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
        id="n1"
        labelPieces={labelPieces}
        labelPiecesPosition={labelPiecesPosition}
        positionX={25}
        positionY={50}
        typeText={"String"}
        valueText={"\"Test\""}
        connectorPlaceholder={"{{}}"}
        placeholderWidth={20}
        stageWidth={width}
        stageHeight={height}
        nodeWidth={computeNodeWidth(labelPieces)}
        nodeHeight={48}
        isFullDisabled={true}
      />
    </Layer>
  </Stage>
</div>
```

Default highlight colors

```jsx
import { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import createPositionUtils from '../../utils/position';
import useContainerWidthOnWindowResize from '../../hooks/useContainerWidthOnWindowResize';

const { 
  computeNodeWidth,
  computeLabelPiecesXCoordinatePositions,
} = createPositionUtils(24, 'Roboto Mono, Courier', "{{}}", 20, 12, 12)

const containerRef = useRef();
const width = useContainerWidthOnWindowResize(containerRef);
const height = 120;
const labelPieces = ["Hello ", "{{}}", " World"];
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
        id="n1"
        labelPieces={labelPieces}
        labelPiecesPosition={labelPiecesPosition}
        positionX={25}
        positionY={50}
        typeText={"String"}
        valueText={"\"Test\""}
        isHighlighted={true}
        isTypeLabelHighlighted={true}
        isValueLabelHighlighted={true}
        connectorPlaceholder={"{{}}"}
        placeholderWidth={20}
        stageWidth={width}
        stageHeight={height}
        nodeWidth={computeNodeWidth(labelPieces)}
        nodeHeight={48}
        isFullDisabled={true}
      />
    </Layer>
  </Stage>
</div>
```

Custom highlight colors

```jsx
import { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import createPositionUtils from '../../utils/position';
import useContainerWidthOnWindowResize from '../../hooks/useContainerWidthOnWindowResize';

const { 
  computeNodeWidth,
  computeLabelPiecesXCoordinatePositions,
} = createPositionUtils(24, 'Roboto Mono, Courier', "{{}}", 20, 12, 12)

const containerRef = useRef();
const width = useContainerWidthOnWindowResize(containerRef);
const height = 120;
const labelPieces = ["Hello ", "{{}}", " World"];
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
        id="n1"
        labelPieces={labelPieces}
        labelPiecesPosition={labelPiecesPosition}
        positionX={25}
        positionY={50}
        typeText={"String"}
        valueText={"\"Test\""}
        isHighlighted={"#ff5555"}
        isTypeLabelHighlighted={"#55aa55"}
        isValueLabelHighlighted={"#5555ff"}
        connectorPlaceholder={"{{}}"}
        placeholderWidth={20}
        stageWidth={width}
        stageHeight={height}
        nodeWidth={computeNodeWidth(labelPieces)}
        nodeHeight={48}
        isFullDisabled={true}
      />
    </Layer>
  </Stage>
</div>
```