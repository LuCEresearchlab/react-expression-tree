import React, { useState } from "react";
import ExpressionTreeEditor from "./ExpressionTreeEditor";

function App() {
  const [stageWidth, setAppWidth] = useState(window.innerWidth);
  const [stageHeight, setAppHeight] = useState(window.innerHeight);

  window.addEventListener("resize", () => {
    console.log(window.innerHeight, window.innerWidth);
    setAppHeight(window.innerHeight);
    setAppWidth(window.innerWidth);
  });

  return (
    <>
      {/* <div style={{ height: "300px" }}></div> */}
      <ExpressionTreeEditor width={stageWidth} height={stageHeight} />
    </>
  );
}

export default App;
