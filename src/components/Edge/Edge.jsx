import React from 'react';
import PropTypes from 'prop-types';
import { Line, Circle, Group } from 'react-konva';

function Edge({
  id,
  childX,
  childY,
  childNodeId,
  childWidth,
  parentX,
  parentY,
  parentNodeId,
  parentPieceId,
  parentPieceX,
  isDragged,
  isFullDisabled,
  isDraggingSelectionRect,
  isSelected,
  selectedEdgeRef,
  setSelectedEdgeRef,
  clearEdgeSelection,
  currentErrorLocation,
  textHeight,
  placeholderWidth,
  nodePaddingX,
  nodePaddingY,
  onEdgeClick,
  onNodeConnectorDragStart,
  onPlaceholderConnectorDragStart,
  setCursor,
  style,
}) {
  // Handle drag start event on edge's node connector end
  const handleNodeConnectorDragStart = (e) => {
    // prevent onDragStart of Group
    e.cancelBubble = true;
    setCursor('grabbing');
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

  // Handle drag start event on edge's placeholder connector end
  const handlePlaceholderConnectorDragStart = (e) => {
    // prevent onDragStart of Group
    e.cancelBubble = true;
    setCursor('grabbing');
    if (selectedEdgeRef) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
      clearEdgeSelection();
    }
    // we don't want the connector to be moved
    e.target.stopDrag();
    // but we want to initiate the moving around of the connection
    onPlaceholderConnectorDragStart(
      parentNodeId,
      parentPieceId,
      e.target.parent.x() + e.target.x() + placeholderWidth / 2,
      e.target.parent.y() + e.target.y() + placeholderWidth * 0.75,
    );
  };

  /**
   *
   * Compute color given a style object
   *
   * @param {Object} stl
   */
  const computeColor = (stl) => {
    if (isDragged) {
      return stl.draggingColor;
    }
    if (currentErrorLocation
      && currentErrorLocation.edge
      && currentErrorLocation.edgeId === id) {
      return stl.errorColor;
    }
    if (isSelected) {
      return stl.selectedColor;
    }
    return stl.color;
  };

  return (
    // Edge is a Group composed of a Line and two Circles
    <Group
      id={id}
      name="Edge"
      onClick={!isFullDisabled && onEdgeClick}
      onTap={isFullDisabled && onEdgeClick}
    >
      <Line
        key={`Edge-Line-${id}`}
        points={[
          childX + childWidth / 2,
          childY,
          parentX + nodePaddingX + parentPieceX + placeholderWidth / 2,
          parentY + nodePaddingY + textHeight / 2,
        ]}
        stroke={computeColor(style)}
        strokeWidth={style.strokeSize}
        hitStrokeWidth={10}
        onMouseOver={
          !isFullDisabled
          && ((e) => {
            e.cancelBubble = true;
            if (!isDraggingSelectionRect) {
              setCursor('pointer');
            }
          })
        }
      />
      <Circle
        x={childX + childWidth / 2}
        y={childY}
        radius={style.connector.child.radiusSize}
        fill={computeColor(style.connector.child)}
        stroke={style.connector.child.strokeColor}
        strokeWidth={style.connector.child.strokeSize}
        draggable
        onDragStart={!isFullDisabled && handleNodeConnectorDragStart}
        onTouchStart={!isFullDisabled && handleNodeConnectorDragStart}
        onMouseOver={
          !isFullDisabled
          && ((e) => {
            e.cancelBubble = true;
            if (!isDraggingSelectionRect) {
              setCursor('grab');
            }
          })
        }
        onDragMove={() => {}}
        onDragEnd={() => {}}
      />
      <Circle
        x={parentX + nodePaddingX + parentPieceX + placeholderWidth / 2}
        y={parentY + nodePaddingY + textHeight / 2}
        radius={style.connector.parent.radiusSize}
        fill={computeColor(style.connector.parent)}
        stroke={style.connector.parent.strokeColor}
        strokeWidth={style.connector.parent.strokeSize}
        draggable
        onDragStart={!isFullDisabled && handlePlaceholderConnectorDragStart}
        onTouchStart={!isFullDisabled && handleNodeConnectorDragStart}
        onMouseOver={
          !isFullDisabled
          && ((e) => {
            e.cancelBubble = true;
            if (!isDraggingSelectionRect) {
              setCursor('grab');
            }
          })
        }
        onDragMove={() => {}}
        onDragEnd={() => {}}
      />
    </Group>
  );
}

Edge.propTypes = {
  id: PropTypes.number.isRequired,
  childX: PropTypes.number.isRequired,
  childY: PropTypes.number.isRequired,
  childNodeId: PropTypes.number.isRequired,
  childWidth: PropTypes.number.isRequired,
  parentX: PropTypes.number.isRequired,
  parentY: PropTypes.number.isRequired,
  parentNodeId: PropTypes.number.isRequired,
  parentPieceId: PropTypes.number.isRequired,
  parentPieceX: PropTypes.number.isRequired,
  isDragged: PropTypes.bool.isRequired,
  isFullDisabled: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isDraggingSelectionRect: PropTypes.bool.isRequired,
  selectedEdgeRef: PropTypes.shape({
    moveToBottom: PropTypes.func,
  }).isRequired,
  setSelectedEdgeRef: PropTypes.func.isRequired,
  clearEdgeSelection: PropTypes.func.isRequired,
  currentErrorLocation: PropTypes.shape({
    edge: PropTypes.string,
    edgeId: PropTypes.string,
  }).isRequired,
  textHeight: PropTypes.number.isRequired,
  placeholderWidth: PropTypes.number.isRequired,
  nodePaddingX: PropTypes.number.isRequired,
  nodePaddingY: PropTypes.number.isRequired,
  onEdgeClick: PropTypes.func,
  onNodeConnectorDragStart: PropTypes.func,
  onPlaceholderConnectorDragStart: PropTypes.func,
  setCursor: PropTypes.func.isRequired,
  style: PropTypes.exact({
    strokeSize: PropTypes.number,
    color: PropTypes.string,
    errorColor: PropTypes.string,
    childConnectorColor: PropTypes.string,
    parentConnectorColor: PropTypes.string,
    selectedColor: PropTypes.string,
    draggingColor: PropTypes.string,
    connector: PropTypes.exact({
      child: PropTypes.exact({
        radiusSize: PropTypes.number,
        color: PropTypes.string,
        emptyColor: PropTypes.string,
        draggingColor: PropTypes.string,
        errorColor: PropTypes.string,
        strokeSize: PropTypes.number,
        strokeColor: PropTypes.string,
      }),
      parent: PropTypes.exact({
        radiusSize: PropTypes.number,
        color: PropTypes.string,
        draggingColor: PropTypes.string,
        errorColor: PropTypes.string,
        strokeSize: PropTypes.number,
        strokeColor: PropTypes.string,
      }),
    }),
  }).isRequired,
};

Edge.defaultProps = {
  onEdgeClick: null,
  onNodeConnectorDragStart: null,
  onPlaceholderConnectorDragStart: null,
};

export default Edge;
