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
    // <div style={{ display: "flex" }}>
    //   <div style={{ width: "100px" }}>fdsgdsfgsdf</div>
    //   <div style={{ display: "block" }}>
    //     <div style={{ height: "700px" }}>dsafadsfadsf</div>
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
      initialState={{
        initialNodes: [
          { pieces: ["19"], x: 320, y: 40, type: "" },
          { pieces: ["age"], x: 320, y: 95, type: "" },
          {
            pieces: ['"Hello World!"'],
            x: 320,
            y: 150,
            type: "",
          },
          {
            pieces: ["-", "{{}}"],
            x: 320,
            y: 205,
            type: "",
          },
          {
            pieces: ["{{}}", "<", "{{}}"],
            x: 320,
            y: 260,
            type: "",
          },
          {
            pieces: ["{{}}", "+", "{{}}"],
            x: 320,
            y: 315,
            type: "",
          },
          {
            pieces: ["(int)", "{{}}"],
            x: 320,
            y: 370,
            type: "",
          },
          {
            pieces: ["{{}}", "?", "{{}}", ":", "{{}}"],
            x: 320,
            y: 425,
            type: "",
          },
          {
            pieces: ["{{}}", ".length"],
            x: 320,
            y: 480,
            type: "",
          },
          {
            pieces: ["{{}}", ".length()"],
            x: 320,
            y: 535,
            type: "",
          },
          {
            pieces: ["{{}}", ".append(", "{{}}", ")"],
            x: 320,
            y: 590,
            type: "",
          },
        ],
        initialEdges: [
          {
            parentNodeId: 4,
            parentPieceId: 1,
            childNodeId: 1,
          },
          {
            parentNodeId: 5,
            parentPieceId: 0,
            childNodeId: 4,
          },
          {
            parentNodeId: 5,
            parentPieceId: 2,
            childNodeId: 2,
          },
          {
            parentNodeId: 8,
            parentPieceId: 0,
            childNodeId: 5,
          },
          {
            parentNodeId: 8,
            parentPieceId: 2,
            childNodeId: 10,
          },
          {
            parentNodeId: 10,
            parentPieceId: 0,
            childNodeId: 3,
          },
        ],
      }}
      nodeTypes={["String", "Number", "Boolean", "Object", "undefined", "null"]}
    />
    //     <div style={{ height: "100px" }}>sdfadsfdas</div>
    //   </div>
    //   <div style={{ width: "100px" }}>fdsgdsfgsdf</div>
    // </div>
  );
}

export default App;
