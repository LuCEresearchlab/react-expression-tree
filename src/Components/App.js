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
          { id: 1, pieces: ["19"], x: 320, y: 40 },
          { id: 2, pieces: ["age"], x: 320, y: 95 },
          {
            id: 3,
            pieces: ['"Hello World!"'],
            x: 320,
            y: 150,
          },
          {
            id: 4,
            pieces: ["-", "{{}}"],
            x: 320,
            y: 205,
          },
          {
            id: 5,
            pieces: ["{{}}", "<", "{{}}"],
            x: 320,
            y: 260,
          },
          {
            id: 6,
            pieces: ["{{}}", "+", "{{}}"],
            x: 320,
            y: 315,
          },
          {
            id: 7,
            pieces: ["(int)", "{{}}"],
            x: 320,
            y: 370,
          },
          {
            id: 8,
            pieces: ["{{}}", "?", "{{}}", ":", "{{}}"],
            x: 320,
            y: 425,
          },
          {
            id: 9,
            pieces: ["{{}}", ".length"],
            x: 320,
            y: 480,
          },
          {
            id: 10,
            pieces: ["{{}}", ".length()"],
            x: 320,
            y: 535,
          },
          {
            id: 11,
            pieces: ["{{}}", ".append(", "{{}}", ")"],
            x: 320,
            y: 590,
          },
        ],
        initialEdges: [
          {
            id: 1,
            parentNodeId: 4,
            parentPieceId: 1,
            childNodeId: 1,
            type: "",
          },
          {
            id: 2,
            parentNodeId: 5,
            parentPieceId: 0,
            childNodeId: 4,
            type: "",
          },
          {
            id: 3,
            parentNodeId: 5,
            parentPieceId: 2,
            childNodeId: 2,
            type: "",
          },
          {
            id: 4,
            parentNodeId: 8,
            parentPieceId: 0,
            childNodeId: 5,
            type: "",
          },
          {
            id: 5,
            parentNodeId: 8,
            parentPieceId: 2,
            childNodeId: 10,
            type: "",
          },
          {
            id: 6,
            parentNodeId: 10,
            parentPieceId: 0,
            childNodeId: 3,
            type: "",
          },
        ],
      }}
      edgeTypes={["String", "Number", "Boolean", "Object", "undefined", "null"]}
    />
    //     <div style={{ height: "100px" }}>sdfadsfdas</div>
    //   </div>
    //   <div style={{ width: "100px" }}>fdsgdsfgsdf</div>
    // </div>
  );
}

export default App;
