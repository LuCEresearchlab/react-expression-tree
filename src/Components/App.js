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
    //     <div style={{ height: "100px" }}>dsafadsfadsf</div>
    <ExpressionTreeEditor
      width={stageWidth}
      height={stageHeight}
      fontSize={24}
      fontFamily="Ubuntu Mono, Courier"
      errorColor="#ff2f2f"
      nodeColor="#208020"
      selectedNodeColor="#3f51b5"
      finalNodeColor="#208080"
      rootConnectorColor="black"
      nodeConnectorColor="black"
      nodeHoleColor="#104010"
      nodeTagColor="#3f51b5"
      nodeTextColor="white"
      nodeDeleteButtonColor="red"
      edgeColor="black"
      edgeChildConnectorColor="#00c0c3"
      edgeParentConnectorColor="#c33100"
      selectedEdgeColor="#3f51b5"
      draggingEdgeColor="#f0f0f0"
      dragEdgeColor="black"
      dragEdgeChildConnectorColor="#00c0c3"
      dragEdgeParentConnectorColor="#c33100"
      toolbarPrimaryColor="#3f51b5"
      toolbarSecondaryColor="#f50057"
      toolbarButtons={{
        drawerButton: true,
        reset: true,
        undo: true,
        redo: true,
        reorder: true,
        validate: true,
        download: true,
        upload: true,
        screenshot: true,
        zoomIn: true,
        zoomOut: true,
        info: true,
        zoomToFit: true,
      }}
      drawerFields={{ addField: true, editField: true }}
      fullDisabled={false}
      allowedErrors={{
        loop: true,
        multiEdgeOnPieceConnector: true,
        multiEdgeOnNodeConnector: true,
      }}
      reportedErrors={{
        structureErrors: {
          loop: true,
          multiEdgeOnPieceConnector: true,
          multiEdgeOnNodeConnector: true,
        },
        completenessErrors: {
          emptyPieceConnector: true,
          missingNodeType: true,
          missingNodeValue: true,
        },
      }}
      connectorPlaceholder="{{}}"
      templateNodes={[
        "{{}}?{{}}:{{}}",
        "{{}}.length",
        "{{}}.append({{}})",
        "-{{}}",
        "{{}}+{{}}",
      ]}
      nodeTypes={["String", "Number", "Boolean", "Object", "undefined", "null"]}
      // nodeTypes={[
      //   "String",
      // { type: "Number", any: true, fixedValues: ["14", '"15"', "16"] },
      //   "Boolean",
      //   "Object",
      //   "undefined",
      //   "null",
      // ]}
      initialState={{
        initialNodes: [
          { pieces: ["19"], x: 320, y: 60, type: "", value: "", isFinal: true },
          {
            pieces: ["age"],
            x: 320,
            y: 115,
            type: "",
            value: "",
            isFinal: false,
          },
          {
            pieces: ['"Hello World!"'],
            x: 320,
            y: 170,
            type: "",
            value: "",
            isFinal: false,
          },
          {
            pieces: ["-", "{{}}"],
            x: 320,
            y: 225,
            type: "",
            value: "",
            isFinal: false,
          },
          {
            pieces: ["{{}}", "<", "{{}}"],
            x: 320,
            y: 280,
            type: "",
            value: "",
            isFinal: true,
          },
          {
            pieces: ["{{}}", "+", "{{}}"],
            x: 320,
            y: 335,
            type: "",
            value: "",
            isFinal: false,
          },
          {
            pieces: ["(int)", "{{}}"],
            x: 320,
            y: 390,
            type: "",
            value: "",
            isFinal: false,
          },
          {
            pieces: ["{{}}", "?", "{{}}", ":", "{{}}"],
            x: 320,
            y: 445,
            type: "",
            value: "",
            isFinal: true,
          },
          {
            pieces: ["{{}}", ".length"],
            x: 320,
            y: 500,
            type: "",
            value: "",
            isFinal: false,
          },
          {
            pieces: ["{{}}", ".length()"],
            x: 320,
            y: 555,
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
            id: 1,
          },
          {
            parentNodeId: 5,
            parentPieceId: 0,
            childNodeId: 4,
            id: 2,
          },
          {
            parentNodeId: 5,
            parentPieceId: 2,
            childNodeId: 2,
            id: 3,
          },
          {
            parentNodeId: 8,
            parentPieceId: 0,
            childNodeId: 5,
            id: 4,
          },
          {
            parentNodeId: 8,
            parentPieceId: 2,
            childNodeId: 10,
            id: 5,
          },
          {
            parentNodeId: 10,
            parentPieceId: 0,
            childNodeId: 3,
            id: 6,
          },
        ],
      }}
      onNodeAdd={function (node) {
        console.log("onNodeAdd", node);
      }}
      onNodeDelete={function (nodeId) {
        console.log("onNodeDelete", nodeId);
      }}
      onNodeSelect={function (node) {
        console.log("onNodeSelect", node);
      }}
      onNodePiecesChange={function (nodePieces) {
        console.log("onNodePiecesChange", nodePieces);
      }}
      onNodeTypeChange={function (nodeType) {
        console.log("onNodeTypeChange", nodeType);
      }}
      onNodeValueChange={function (nodeValue) {
        console.log("onNodeValueChange", nodeValue);
      }}
      onEdgeAdd={function (edge) {
        console.log("onEdgeAdd", edge);
      }}
      onEdgeDelete={function (edgeId) {
        console.log("onEdgeDelete", edgeId);
      }}
      onEdgeUpdate={function (edge) {
        console.log("onEdgeUpdate", edge);
      }}
      onEdgeSelect={function (edge) {
        console.log("onEdgeSelect", edge);
      }}
      onValidate={function (nodes, edges, errors) {
        console.log("onValidate", nodes, edges, errors);
      }}
    />
    //     <div style={{ height: "100px" }}>sdfadsfdas</div>
    //   </div>
    //   <div style={{ width: "100px" }}>fdsgdsfgsdf</div>
    // </div>
  );
}

export default App;
