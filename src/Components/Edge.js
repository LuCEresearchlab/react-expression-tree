import React from "react";
import { Line, Circle, Group } from "react-konva";
import { xPad, yPad, holeWidth, textHeight, fontSize } from "../utils.js";

function Edge({
  id,
  childWidth,
  parentPieceX,
  parentX,
  parentY,
  childX,
  childY,
  beingDragged,
  onEdgeClick,
  onNodeConnectorDragStart,
  onPieceConnectorDragStart,
  selected,
  parentNodeId,
  parentPieceId,
  childNodeId,
  selectedEdgeRef,
  setSelectedEdgeRef,
  clearEdgeSelection,
  draggingSelectionRect,
  fullDisabled,
}) {
  const handleNodeConnectorDragStart = e => {
    e.cancelBubble = true; // prevent onDragStart of Group
    document.body.style.cursor = "grabbing";
    if (selectedEdgeRef) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
      clearEdgeSelection();
    }
    // we don't want the connector to be moved
    e.target.stopDrag();
    // but we want to initiate the moving around of the connection
    onNodeConnectorDragStart(childNodeId, e.target.x(), e.target.y());
  };

  const handlePieceConnectorDragStart = e => {
    e.cancelBubble = true; // prevent onDragStart of Group
    document.body.style.cursor = "grabbing";
    if (selectedEdgeRef) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
      clearEdgeSelection();
    }
    // const pos = e.target.absolutePosition();
    // we don't want the connector to be moved
    e.target.stopDrag();
    // but we want to initiate the moving around of the connection
    onPieceConnectorDragStart(
      parentNodeId,
      parentPieceId,
      e.target.parent.x() + e.target.x() + holeWidth / 2,
      e.target.parent.y() + e.target.y() + holeWidth * 0.75
    );
  };

  return (
    <Group onClick={!fullDisabled && onEdgeClick}>
      <Line
        key={"Edge-Line-" + id}
        points={[
          childX + childWidth / 2,
          childY,
          parentX + xPad + parentPieceX + holeWidth / 2,
          parentY + yPad + textHeight / 2,
        ]}
        stroke={beingDragged ? "#f0f0f0" : selected ? "#3f50b5" : "black"}
        strokeWidth={fontSize / 4}
        lineCap="round"
        lineJoin="round"
        hitStrokeWidth={10}
        onMouseOver={
          !fullDisabled &&
          (e => {
            e.cancelBubble = true;
            if (!draggingSelectionRect) {
              document.body.style.cursor = "pointer";
            }
          })
        }
      />
      <Circle
        x={childX + childWidth / 2}
        y={childY}
        radius={fontSize / 4}
        fill={beingDragged ? "#f0f0f0" : selected ? "#3f50b5" : "black"}
        stroke="black"
        strokeWidth={1}
        draggable
        onDragStart={!fullDisabled && handleNodeConnectorDragStart}
        onDragMove={() => {}}
        onDragEnd={() => {}}
        onMouseOver={
          !fullDisabled &&
          (e => {
            e.cancelBubble = true;
            if (!draggingSelectionRect) {
              document.body.style.cursor = "grab";
            }
          })
        }
      />
      <Circle
        x={parentX + xPad + parentPieceX + holeWidth / 2}
        y={parentY + yPad + textHeight / 2}
        radius={fontSize / 4}
        fill={beingDragged ? "#f0f0f0" : selected ? "#3f50b5" : "black"}
        stroke="black"
        strokeWidth={1}
        draggable
        onDragStart={!fullDisabled && handlePieceConnectorDragStart}
        onDragMove={e => {}}
        onDragEnd={e => {}}
        onMouseOver={
          !fullDisabled &&
          (e => {
            e.cancelBubble = true;
            if (!draggingSelectionRect) {
              document.body.style.cursor = "grab";
            }
          })
        }
      />
    </Group>
  );
}

export default Edge;
