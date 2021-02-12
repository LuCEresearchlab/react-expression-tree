Type + Value:

```jsx
import { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import useContainerWidthOnWindowResize from '../../../hooks/useContainerWidthOnWindowResize';

const containerRef = useRef();
const width = useContainerWidthOnWindowResize(containerRef);
const height = 50;

;<div
  ref={containerRef}
>
  <Stage
    width={width}
    height={height}
    offsetY={-50}
  >
    <Layer>
      <NodeTypeValue
        typeText={"String"}
        valueText={"\"Hello World\""}
        nodeWidth={200}
      />
    </Layer>
  </Stage>
</div>
```


Only Type:

```jsx
import { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import useContainerWidthOnWindowResize from '../../../hooks/useContainerWidthOnWindowResize';

const containerRef = useRef();
const width = useContainerWidthOnWindowResize(containerRef);
const height = 50;

;<div
  ref={containerRef}
>
  <Stage
    width={width}
    height={height}
    offsetY={-50}
  >
    <Layer>
      <NodeTypeValue
        typeText={"String"}
        nodeWidth={100}
      />
    </Layer>
  </Stage>
</div>
```

Only Value:

```jsx
import { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import useContainerWidthOnWindowResize from '../../../hooks/useContainerWidthOnWindowResize';

const containerRef = useRef();
const width = useContainerWidthOnWindowResize(containerRef);
const height = 50;

;<div
  ref={containerRef}
>
  <Stage
    width={width}
    height={height}
    offsetY={-50}
  >
    <Layer>
      <NodeTypeValue
        valueText={"\"Hello World\""}
        nodeWidth={150}
      />
    </Layer>
  </Stage>
</div>
```