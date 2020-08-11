import React from 'react';
import Node from './Node.js';
import { 
  Stage, 
  Layer, 
} from "react-konva";

function App() {
  const nodes = [
    [ "19" ],
    [ "age" ],
    [ "\"Hello World!\"" ],
    [ "-", null ],
    [ null, "<", null ],
    [ null, "+", null ],
    [ "(int)", null ],
    [ null, "?", null, ":", null ],
    [ null, ".", "length" ],
    [ null, ".", "length()" ],
    [ null, ".", "append(", null, ")" ],
  ];
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {
          nodes.map((node,i) => (
            <Node
              key={i}
              row={i}
              pieces={node}
            />
          ))
        }
      </Layer>
    </Stage>
  );
}

export default App;
