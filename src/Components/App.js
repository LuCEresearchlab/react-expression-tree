import React, { useState, useEffect, useRef } from "react";
import ExpressionTreeEditor from "./ExpressionTreeEditor.js";

function App() {
  const appRef = useRef();

  const [appWidth, setAppWidth] = useState();
  const [appHeight, setAppHeight] = useState(window.innerHeight); //FIX

  useEffect(() => {
    if (appRef.current) {
      setAppHeight(appRef.current.offsetHeight);
      setAppWidth(appRef.current.offsetWidth);
    }
  }, [appRef]);

  return (
    <div style={{ display: "block", visibility: "visible" }} ref={appRef}>
      <ExpressionTreeEditor width={appWidth} height={appHeight} />
    </div>
  );
}

export default App;
