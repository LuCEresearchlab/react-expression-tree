import React from "react";
import { Text, Line, Circle, Group } from "react-konva";
import { xPad, yPad, holeWidth, textHeight } from "../utils.js";

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
  type,
  parentNodeId,
  parentPieceId,
  childNodeId,
  selectedEdgeRef,
  setSelectedEdgeRef,
  clearEdgeSelection,
}) {
  const handleNodeConnectorDragStart = e => {
    e.cancelBubble = true; // prevent onDragStart of Group
    if (selectedEdgeRef !== null) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
      clearEdgeSelection();
    }
    document.body.style.cursor = "grabbing";
    // we don't want the connector to be moved
    e.target.stopDrag();
    // but we want to initiate the moving around of the connection
    onNodeConnectorDragStart(childNodeId, e.target.x(), e.target.y());
  };

  const handlePieceConnectorDragStart = e => {
    e.cancelBubble = true; // prevent onDragStart of Group
    if (selectedEdgeRef !== null) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
      clearEdgeSelection();
    }
    document.body.style.cursor = "grabbing";
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
    <Group onClick={onEdgeClick}>
      <Line
        key={"Edge-Line-" + id}
        points={[
          childX + xPad + childWidth / 2,
          childY,
          parentX + xPad + parentPieceX + holeWidth / 2,
          parentY + yPad + textHeight / 2,
        ]}
        stroke={beingDragged ? "#f0f0f0" : selected ? "#3f50b5" : "black"}
        strokeWidth={5}
        lineCap="round"
        lineJoin="round"
        hitStrokeWidth={10}
      />
      <Text
        key={"Edge-Text-" + id}
        x={childX + xPad + childWidth / 2}
        y={childY - 30}
        fill="#3f50b5"
        fontFamily={"Arial"}
        fontSize={20}
        text={type}
        onClick={onEdgeClick}
      />
      <Circle
        x={childX + xPad + childWidth / 2}
        y={childY}
        radius={6}
        fill={beingDragged ? "#f0f0f0" : selected ? "#3f50b5" : "black"}
        draggable
        onDragStart={handleNodeConnectorDragStart}
        onDragMove={() => {}}
        onDragEnd={() => {}}
        onMouseOver={e => {
          e.cancelBubble = true;
          document.body.style.cursor = "grab";
        }}
      />
      <Circle
        x={parentX + xPad + parentPieceX + holeWidth / 2}
        y={parentY + yPad + textHeight / 2}
        radius={5}
        fill={beingDragged ? "#f0f0f0" : selected ? "#3f50b5" : "black"}
        draggable
        onDragStart={handlePieceConnectorDragStart}
        onDragMove={e => {}}
        onDragEnd={e => {}}
        onMouseOver={e => {
          e.cancelBubble = true;
          document.body.style.cursor = "grab";
        }}
      />
    </Group>
  );
}

export default Edge;
