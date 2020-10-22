import React, { useState } from "react";
import ExpressionTreeEditor from "./ExpressionTreeEditor";

function App() {
  const [stageWidth, setAppWidth] = useState(window.innerWidth);
  const [stageHeight, setAppHeight] = useState(window.innerHeight);

  window.addEventListener("resize", () => {
    setAppHeight(window.innerHeight);
    setAppWidth(window.innerWidth);
  });

  return (
    <ExpressionTreeEditor
      width={stageWidth}
      height={stageHeight}
      connectorPlaceholder="{{}}"
    />
  );
}

export default App;
