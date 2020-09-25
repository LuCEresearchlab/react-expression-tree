import React from "react";
import ExpressionTreeEditor from "./ExpressionTreeEditor.js";

function App() {
  return (
    <ExpressionTreeEditor
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
}

export default App;
