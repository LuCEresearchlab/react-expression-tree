import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Line, Circle, Group } from 'react-konva';

function Edge({
  id,
  childX,
  childY,
  parentX,
  parentY,
  childNodeId,
  parentNodeId,
  parentPieceId,
  isDragged,
  isFullDisabled,
  isSelected,
  isHighlighted,
  currentErrorLocation,
  handleEdgeClick,
  handleConnectorDragStart,
  handleConnectorDragMove,
  handleConnectorDragEnd,
  setCursor,
  placeholderWidth,
  lineStrokeWidth,
  lineStrokeColor,
  lineSelectedStrokeColor,
  lineDraggingStrokeColor,
  lineErrorStrokeColor,
  lineHighlightColor,
  childConnectorRadiusSize,
  childConnectorStrokeColor,
  childConnectorStrokeWidth,
  childConnectorFillColor,
  childConnectorSelectedFillColor,
  childConnectorDraggingFillColor,
  childConnectorErrorFillColor,
  childConnectorHighlightFillColor,
  parentConnectorRadiusSize,
  parentConnectorStrokeColor,
  parentConnectorStrokeWidth,
  parentConnectorFillColor,
  parentConnectorSelectedFillColor,
  parentConnectorDraggingFillColor,
  parentConnectorErrorFillColor,
  parentConnectorHighlightFillColor,
}) {
  const handleNodeConnectorDragStart = useCallback((e) => {
    e.cancelBubble = true;
    e.target.stopDrag();

    if (isFullDisabled) {
      return;
    }

    handleConnectorDragStart(
      false,
      childNodeId,
      e.target.x(),
      e.target.y(),
    );
  });

  const handlePlaceholderConnectorDragStart = useCallback((e) => {
    e.cancelBubble = true;
    e.target.stopDrag();

    if (isFullDisabled) {
      return;
    }

    handleConnectorDragStart(
      true,
      parentNodeId,
      e.target.parent.x() + e.target.x() + placeholderWidth / 2,
      e.target.parent.y() + e.target.y() + placeholderWidth * 0.75,
      parentPieceId,
    );
  });

  const handleMouseOverLine = useCallback((e) => {
    e.cancelBubble = true;
    if (isFullDisabled) {
      return;
    }
    setCursor('pointer');
  });

  const handleMouseOverCircle = useCallback((e) => {
    e.cancelBubble = true;
    if (isFullDisabled) {
      return;
    }
    setCursor('grab');
  });

  const onEdgeClick = useCallback((e) => handleEdgeClick(e, id));

  /**
   * Compute color given a style object
   * @param {Object} stl
   */
  const computeColor = (defaultColor, selectedColor, draggingColor, errorColor, highlightColor) => {
    if (isDragged) {
      return draggingColor;
    }
    if (currentErrorLocation
      && currentErrorLocation.edge
      && currentErrorLocation.edgeId === id) {
      return errorColor;
    }
    if (isSelected) {
      return selectedColor;
    }
    if (isHighlighted) {
      return highlightColor;
    }
    return defaultColor;
  };

  return (
    // Edge is a Group composed of a Line and two Circles
    <Group
      id={id}
      name="Edge"
      onClick={onEdgeClick}
      onTap={onEdgeClick}
    >
      <Line
        key={`edge-${id}`}
        points={[childX, childY, parentX, parentY]}
        stroke={computeColor(
          lineStrokeColor,
          lineSelectedStrokeColor,
          lineDraggingStrokeColor,
          lineErrorStrokeColor,
          lineHighlightColor,
        )}
        strokeWidth={lineStrokeWidth}
        hitStrokeWidth={10}
        onMouseOver={handleMouseOverLine}
      />
      <Circle
        x={childX}
        y={childY}
        radius={childConnectorRadiusSize}
        fill={computeColor(
          childConnectorFillColor,
          childConnectorSelectedFillColor,
          childConnectorDraggingFillColor,
          childConnectorErrorFillColor,
          childConnectorHighlightFillColor,
        )}
        stroke={childConnectorStrokeColor}
        strokeWidth={childConnectorStrokeWidth}
        // draggable={!isFullDisabled}
        // onDragStart={handleNodeConnectorDragStart}
        // onMouseOver={handleMouseOverCircle}
        // onDragMove={handleConnectorDragMove}
        // onDragEnd={handleConnectorDragEnd}
      />
      <Circle
        x={parentX}
        y={parentY}
        radius={parentConnectorRadiusSize}
        fill={computeColor(
          parentConnectorFillColor,
          parentConnectorSelectedFillColor,
          parentConnectorDraggingFillColor,
          parentConnectorErrorFillColor,
          parentConnectorHighlightFillColor,
        )}
        stroke={parentConnectorStrokeColor}
        strokeWidth={parentConnectorStrokeWidth}
        // draggable={!isFullDisabled}
        // onDragStart={handlePlaceholderConnectorDragStart}
        // onMouseOver={handleMouseOverCircle}
        // onDragMove={handleConnectorDragMove}
        // onDragEnd={handleConnectorDragEnd}
      />
    </Group>
  );
}

Edge.propTypes = {
  id: PropTypes.number.isRequired,
  childX: PropTypes.number.isRequired,
  childY: PropTypes.number.isRequired,
  parentX: PropTypes.number.isRequired,
  parentY: PropTypes.number.isRequired,
  childNodeId: PropTypes.number.isRequired,
  parentNodeId: PropTypes.number.isRequired,
  parentPieceId: PropTypes.number.isRequired,
  isDragged: PropTypes.bool,
  isFullDisabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  currentErrorLocation: PropTypes.shape({
    edge: PropTypes.string,
    edgeId: PropTypes.string,
  }),
  handleEdgeClick: PropTypes.func,
  handleConnectorDragStart: PropTypes.func,
  handleConnectorDragMove: PropTypes.func,
  handleConnectorDragEnd: PropTypes.func,
  setCursor: PropTypes.func,
  placeholderWidth: PropTypes.number.isRequired,

  lineStrokeWidth: PropTypes.number,
  lineStrokeColor: PropTypes.string,
  lineErrorStrokeColor: PropTypes.string,
  lineSelectedStrokeColor: PropTypes.string,
  lineDraggingStrokeColor: PropTypes.string,
  lineHighlightColor: PropTypes.string,
  childConnectorRadiusSize: PropTypes.number,
  childConnectorStrokeColor: PropTypes.string,
  childConnectorStrokeWidth: PropTypes.number,
  childConnectorFillColor: PropTypes.string,
  childConnectorSelectedFillColor: PropTypes.string,
  childConnectorDraggingFillColor: PropTypes.string,
  childConnectorErrorFillColor: PropTypes.string,
  childConnectorHighlightFillColor: PropTypes.string,
  parentConnectorRadiusSize: PropTypes.number,
  parentConnectorStrokeColor: PropTypes.string,
  parentConnectorStrokeWidth: PropTypes.number,
  parentConnectorFillColor: PropTypes.string,
  parentConnectorSelectedFillColor: PropTypes.string,
  parentConnectorDraggingFillColor: PropTypes.string,
  parentConnectorErrorFillColor: PropTypes.string,
  parentConnectorHighlightFillColor: PropTypes.string,
};

Edge.defaultProps = {
  isDragged: false,
  isFullDisabled: false,
  isSelected: false,
  isHighlighted: false,
  currentErrorLocation: null,
  handleEdgeClick: () => {},
  handleConnectorDragStart: () => {},
  handleConnectorDragMove: () => {},
  handleConnectorDragEnd: () => {},
  setCursor: () => {},
  lineStrokeWidth: 6,
  lineStrokeColor: '#000000',
  lineErrorStrokeColor: '#ff2f2f',
  lineSelectedStrokeColor: '#f2a200',
  lineDraggingStrokeColor: '#f2d280',
  lineHighlightColor: '#cc78c5',
  childConnectorRadiusSize: 6,
  childConnectorStrokeColor: '#000000',
  childConnectorStrokeWidth: 1,
  childConnectorFillColor: '#555555',
  childConnectorSelectedFillColor: '#f2a200',
  childConnectorDraggingFillColor: '#f2d280',
  childConnectorErrorFillColor: '#ff2f2f',
  childConnectorHighlightFillColor: '#cc78c5',
  parentConnectorRadiusSize: 6,
  parentConnectorStrokeColor: '#000000',
  parentConnectorStrokeWidth: 1,
  parentConnectorFillColor: '#555555',
  parentConnectorSelectedFillColor: '#f2a200',
  parentConnectorDraggingFillColor: '#f2d280',
  parentConnectorErrorFillColor: '#ff2f2f',
  parentConnectorHighlightFillColor: '#cc78c5',
};

export default Edge;
