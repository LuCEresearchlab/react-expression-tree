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
      selectionRectColor="rgba(002550.2)"
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
        fullScreen: true,
      }}
      drawerFields={{ addField: true, editField: true }}
      fullDisabled={false}
      allowedErrors={{
        loop: true,
        multiEdgeOnHoleConnector: true,
        multiEdgeOnNodeConnector: true,
      }}
      reportedErrors={{
        structureErrors: {
          loop: true,
          multiEdgeOnHoleConnector: true,
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
        "[{{}}]",
        "{{}}.{{}}",
        "{{}}.length",
        "-{{}}",
        "{{}}+{{}}",
        "{{}}-{{}}",
        "{{}}*{{}}",
        "{{}}/{{}}",
        "{{}}>{{}}",
        "{{}}<{{}}",
        "{{}}>={{}}",
        "{{}}<={{}}",
      ]}
      nodeTypes={[
        {
          type: "String",
          any: true,
          fixedValues: ['"Hello"', '"World"', '"!"', '" "', '"Hello World!"'],
        },
        { type: "Number", any: true },
        { type: "Boolean", any: false, fixedValues: ["true", "false"] },
        {
          type: "Object",
          any: true,
          fixedValues: [],
        },
        { type: "Undefined", any: false, fixedValues: ["undefined"] },
        { type: "Null", fixedValues: ["null"] },
      ]}
      initialState={{
        initialNodes: [
          {
            pieces: ["{{}}", "+", "{{}}"],
            x: 320,
            y: 90,
            type: "",
            value: "",
            isFinal: true,
          },
          {
            pieces: ["3"],
            x: 410,
            y: 90,
            type: "",
            value: "",
            isFinal: true,
          },
        ],
        initialEdges: [],
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
      onNodeMove={function (nodeId, position) {
        console.log("onNodeMove", nodeId, position);
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
