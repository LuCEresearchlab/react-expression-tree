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
    <>
      {/* <div style={{ height: "200px" }}>bbb</div> */}
      <div style={{ display: "flex" }}>
        {/* <div style={{ minWidth: "400px" }}>aaaaa</div> */}
        <ExpressionTreeEditor
          width={stageWidth}
          height={stageHeight}
          connectorPlaceholder="{{}}"
          templateNodes={[
            "{{}}?{{}}:{{}}",
            "{{}}.length",
            "{{}}.append({{}})",
            "-{{}}",
            "{{}}+{{}}",
          ]}
        />
      </div>
    </>
  );
}

export default App;
