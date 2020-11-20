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
      allowStructuralErrors={true}
      connectorPlaceholder="{{}}"
      templateNodes={[
        "{{}}?{{}}:{{}}",
        "{{}}.length",
        "{{}}.append({{}})",
        "-{{}}",
        "{{}}+{{}}",
      ]}
      nodeTypes={["String", "Number", "Boolean", "Object", "undefined", "null"]}
      initialState={{
        initialNodes: [
          { pieces: ["19"], x: 320, y: 40, type: "", isFinal: true },
          { pieces: ["age"], x: 320, y: 95, type: "", isFinal: false },
          {
            pieces: ['"Hello World!"'],
            x: 320,
            y: 150,
            type: "",
            isFinal: false,
          },
          {
            pieces: ["-", "{{}}"],
            x: 320,
            y: 205,
            type: "",
            isFinal: false,
          },
          {
            pieces: ["{{}}", "<", "{{}}"],
            x: 320,
            y: 260,
            type: "",
            isFinal: true,
          },
          {
            pieces: ["{{}}", "+", "{{}}"],
            x: 320,
            y: 315,
            type: "",
            isFinal: false,
          },
          {
            pieces: ["(int)", "{{}}"],
            x: 320,
            y: 370,
            type: "",
            isFinal: false,
          },
          {
            pieces: ["{{}}", "?", "{{}}", ":", "{{}}"],
            x: 320,
            y: 425,
            type: "",
            isFinal: true,
          },
          {
            pieces: ["{{}}", ".length"],
            x: 320,
            y: 480,
            type: "",
            isFinal: false,
          },
          {
            pieces: ["{{}}", ".length()"],
            x: 320,
            y: 535,
            type: "",
            isFinal: false,
          },
          {
            pieces: ["{{}}", ".append(", "{{}}", ")"],
            x: 320,
            y: 590,
            type: "",
            isFinal: false,
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
    />
    //     <div style={{ height: "100px" }}>sdfadsfdas</div>
    //   </div>
    //   <div style={{ width: "100px" }}>fdsgdsfgsdf</div>
    // </div>
  );
}

export default App;
