import React from "react";
import PropTypes from "prop-types";
import { Line, Circle, Group } from "react-konva";

function Edge({
  id,
  parentNodeId,
  parentPieceId,
  parentPieceX,
  parentX,
  parentY,
  childNodeId,
  childWidth,
  childX,
  childY,
  selected,
  beingDragged,
  fullDisabled,
  fontSize,
  fontFamily,
  xPad,
  yPad,
  holeWidth,
  textHeight,
  errorColor,
  edgeColor,
  edgeChildConnectorColor,
  edgeParentConnectorColor,
  selectedEdgeColor,
  draggingEdgeColor,
  selectedEdgeRef,
  setSelectedEdgeRef,
  draggingSelectionRect,
  clearEdgeSelection,
  currentErrorLocation,
  onEdgeClick,
  onNodeConnectorDragStart,
  onHoleConnectorDragStart,
}) {
  // Handle drag start event on edge's node connector end
  const handleNodeConnectorDragStart = e => {
    // prevent onDragStart of Group
    e.cancelBubble = true;
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

  // Handle drag start event on edge's hole connector end
  const handleHoleConnectorDragStart = e => {
    // prevent onDragStart of Group
    e.cancelBubble = true;
    document.body.style.cursor = "grabbing";
    if (selectedEdgeRef) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
      clearEdgeSelection();
    }
    // we don't want the connector to be moved
    e.target.stopDrag();
    // but we want to initiate the moving around of the connection
    onHoleConnectorDragStart(
      parentNodeId,
      parentPieceId,
      e.target.parent.x() + e.target.x() + holeWidth / 2,
      e.target.parent.y() + e.target.y() + holeWidth * 0.75
    );
  };

  return (
    // Edge is a Group composed of a Line and two Circle ends components
    <Group
      id={id}
      name="Edge"
      onClick={!fullDisabled && onEdgeClick}
      onTap={fullDisabled && onEdgeClick}
    >
      <Line
        key={"Edge-Line-" + id}
        points={[
          childX + childWidth / 2,
          childY,
          parentX + xPad + parentPieceX + holeWidth / 2,
          parentY + yPad + textHeight / 2,
        ]}
        stroke={
          beingDragged
            ? draggingEdgeColor
            : currentErrorLocation &&
              currentErrorLocation.edge &&
              currentErrorLocation.edgeId === id
            ? errorColor
            : selected
            ? selectedEdgeColor
            : edgeColor
        }
        strokeWidth={fontSize / 4}
        lineCap="round"
        lineJoin="round"
        hitStrokeWidth={10}
        shadowEnabled={selected ? true : false}
        shadowColor="black"
        shadowOffset={{ x: 3, y: 3 }}
        shadowBlur={3}
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
        fill={
          beingDragged
            ? draggingEdgeColor
            : currentErrorLocation &&
              currentErrorLocation.edge &&
              currentErrorLocation.edgeId === id
            ? errorColor
            : edgeChildConnectorColor
        }
        stroke="black"
        strokeWidth={1}
        shadowEnabled={selected ? true : false}
        shadowColor="black"
        shadowOffset={{ x: 2, y: 2 }}
        shadowBlur={3}
        shadowForStrokeEnabled={false}
        draggable
        onDragStart={!fullDisabled && handleNodeConnectorDragStart}
        onTouchStart={!fullDisabled && handleNodeConnectorDragStart}
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
        fill={
          beingDragged
            ? draggingEdgeColor
            : currentErrorLocation &&
              currentErrorLocation.edge &&
              currentErrorLocation.edgeId === id
            ? errorColor
            : edgeParentConnectorColor
        }
        stroke="black"
        strokeWidth={1}
        shadowEnabled={selected ? true : false}
        shadowColor="black"
        shadowOffset={{ x: 2, y: 2 }}
        shadowBlur={3}
        shadowForStrokeEnabled={false}
        draggable
        onDragStart={!fullDisabled && handleHoleConnectorDragStart}
        onTouchStart={!fullDisabled && handleNodeConnectorDragStart}
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

Edge.propTypes = {
  id: PropTypes.number,
  parentNodeId: PropTypes.number,
  parentPieceId: PropTypes.number,
  parentPieceX: PropTypes.number,
  parentX: PropTypes.number,
  parentY: PropTypes.number,
  childNodeId: PropTypes.number,
  childWidth: PropTypes.number,
  childX: PropTypes.number,
  childY: PropTypes.number,
  selected: PropTypes.bool,
  beingDragged: PropTypes.bool,
  fullDisabled: PropTypes.bool,
  fontSize: PropTypes.number,
  fontFamily: PropTypes.string,
  xPad: PropTypes.number,
  yPad: PropTypes.number,
  holeWidth: PropTypes.number,
  textHeight: PropTypes.number,
  errorColor: PropTypes.string,
  edgeColor: PropTypes.string,
  edgeChildConnectorColor: PropTypes.string,
  edgeParentConnectorColor: PropTypes.string,
  selectedEdgeColor: PropTypes.string,
  draggingEdgeColor: PropTypes.string,
  selectedEdgeRef: PropTypes.object,
  setSelectedEdgeRef: PropTypes.func,
  draggingSelectionRect: PropTypes.bool,
  clearEdgeSelection: PropTypes.func,
  currentErrorLocation: PropTypes.object,
  onEdgeClick: PropTypes.func,
  onNodeConnectorDragStart: PropTypes.func,
  onHoleConnectorDragStart: PropTypes.func,
};

export default Edge;
