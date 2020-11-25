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
      allowedErrors={{
        // loop: true,
        multiEdgeOnPieceConnector: true,
        multiEdgeOnNodeConnector: false,
      }}
      reportedErrors={{
        loop: true,
        multiEdgeOnPieceConnector: true,
        multiEdgeOnNodeConnector: true,
        emptyPieceConnector: true,
        missingNodeType: true,
        missingNodeValue: true,
      }}
      connectorPlaceholder="{{}}"
      templateNodes={[
        "{{}}?{{}}:{{}}",
        "{{}}.length",
        "{{}}.append({{}})",
        "-{{}}",
        "{{}}+{{}}",
      ]}
      // toolbarFields={{ addField: true, editField: true }}
      // fullDisabled={false}
      nodeTypes={["String", "Number", "Boolean", "Object", "undefined", "null"]}
      // nodeTypes={[
      //   "String",
      // { type: "Number", any: true, fixedValues: ["14", '"15"', "16"] },
      //   "Boolean",
      //   "Object",
      //   "undefined",
      //   "null",
      // ]}
      // {type: "String", any: true}
      initialState={{
        initialNodes: [
          { pieces: ["19"], x: 320, y: 40, type: "", value: "", isFinal: true },
          {
            pieces: ["age"],
            x: 320,
            y: 95,
            type: "",
            value: "",
            isFinal: false,
          },
          {
            pieces: ['"Hello World!"'],
            x: 320,
            y: 150,
            type: "",
            value: "",
            isFinal: false,
          },
          {
            pieces: ["-", "{{}}"],
            x: 320,
            y: 205,
            type: "",
            value: "",
            isFinal: false,
          },
          {
            pieces: ["{{}}", "<", "{{}}"],
            x: 320,
            y: 260,
            type: "",
            value: "",
            isFinal: true,
          },
          {
            pieces: ["{{}}", "+", "{{}}"],
            x: 320,
            y: 315,
            type: "",
            value: "",
            isFinal: false,
          },
          {
            pieces: ["(int)", "{{}}"],
            x: 320,
            y: 370,
            type: "",
            value: "",
            isFinal: false,
          },
          {
            pieces: ["{{}}", "?", "{{}}", ":", "{{}}"],
            x: 320,
            y: 425,
            type: "",
            value: "",
            isFinal: true,
          },
          {
            pieces: ["{{}}", ".length"],
            x: 320,
            y: 480,
            type: "",
            value: "",
            isFinal: false,
          },
          {
            pieces: ["{{}}", ".length()"],
            x: 320,
            y: 535,
            type: "",
            value: "",
            isFinal: false,
          },
          {
            pieces: ["{{}}", ".append(", "{{}}", ")"],
            x: 320,
            y: 590,
            type: "",
            value: "",
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
      // onChange={function (tree) {}}
      // onNodeLabelChange={function (node, label) {}}
      // onNodeAdd={function (node, label) {}}
      // onNodeDelete={function (nodeId) {}}
      // onEdgeAdd={function (edge, node1, node2) {}}
      // onEdgeDelete={function (edgeId, node1, node2) {}}
      // onTypeChange={function (node, type) {}}
      // onValueChange={function (node, value) {}}
      // onReorder={function (tree) {}}
      // onValidate={function (tree, errors) {}}
    />
    //     <div style={{ height: "100px" }}>sdfadsfdas</div>
    //   </div>
    //   <div style={{ width: "100px" }}>fdsgdsfgsdf</div>
    // </div>
  );
}

export default App;
