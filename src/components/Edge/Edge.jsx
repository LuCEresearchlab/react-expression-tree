import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Line, Circle, Group } from 'react-konva';

import defaultStyle from '../../style/default.json';

import {
  nodeById,
  nodePositionById,
} from '../../utils/tree';

function Edge({
  id,
  nodes,
  childNodeId,
  parentNodeId,
  parentPieceId,
  isDragged,
  isFullDisabled,
  isDraggingSelectionRect,
  isSelected,
  currentErrorLocation,
  nodePaddingX,
  nodePaddingY,
  handleEdgeClick,
  handleConnectorDragStart,
  handleConnectorDragMove,
  handleConnectorDragEnd,
  computeLabelPiecesXCoordinatePositions,
  setCursor,
  placeholderWidth,
  fontSize,
  style,
}) {
  const [
    startX,
    startY,
    endX,
    endY,
  ] = useMemo(() => {
    const {
      width,
    } = nodeById(childNodeId, nodes);
    const {
      pieces: parentPieces,
    } = nodeById(parentNodeId, nodes);
    const parentPieceX = computeLabelPiecesXCoordinatePositions(parentPieces)[parentPieceId];
    const { x: childX, y: childY } = nodePositionById(childNodeId, nodes);
    const { x: parentX, y: parentY } = nodePositionById(parentNodeId, nodes);

    return [
      childX + width / 2,
      childY,
      parentX + nodePaddingX + parentPieceX + placeholderWidth / 2,
      parentY + nodePaddingY + fontSize / 2,
    ];
  }, [
    nodes,
    childNodeId,
    parentNodeId,
    parentPieceId,
    nodePaddingX,
    nodePaddingY,
    placeholderWidth,
    fontSize,
  ]);

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

  // Handle drag start event on edge's placeholder connector end
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

    if (!isDraggingSelectionRect) {
      setCursor('pointer');
    }
  });

  const handleMouseOverCircle = useCallback((e) => {
    e.cancelBubble = true;
    if (isFullDisabled) {
      return;
    }

    if (!isDraggingSelectionRect) {
      setCursor('grab');
    }
  });

  const onEdgeClick = useCallback((e) => handleEdgeClick(e, id));

  /**
   * Compute color given a style object
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
      onClick={onEdgeClick}
      onTap={onEdgeClick}
    >
      <Line
        key={`edge-${id}`}
        points={[startX, startY, endX, endY]}
        stroke={computeColor(style)}
        strokeWidth={style.strokeSize}
        hitStrokeWidth={10}
        onMouseOver={handleMouseOverLine}
      />
      <Circle
        x={startX}
        y={startY}
        radius={style.connector.child.radiusSize}
        fill={computeColor(style.connector.child)}
        stroke={style.connector.child.strokeColor}
        strokeWidth={style.connector.child.strokeSize}
        draggable={!isFullDisabled}
        onDragStart={handleNodeConnectorDragStart}
        onTouchStart={handleNodeConnectorDragStart}
        onMouseOver={handleMouseOverCircle}
        onDragMove={handleConnectorDragMove}
        onDragEnd={handleConnectorDragEnd}
      />
      <Circle
        x={endX}
        y={endY}
        radius={style.connector.parent.radiusSize}
        fill={computeColor(style.connector.parent)}
        stroke={style.connector.parent.strokeColor}
        strokeWidth={style.connector.parent.strokeSize}
        draggable={!isFullDisabled}
        onDragStart={handlePlaceholderConnectorDragStart}
        onTouchStart={handleNodeConnectorDragStart}
        onMouseOver={handleMouseOverCircle}
        onDragMove={handleConnectorDragMove}
        onDragEnd={handleConnectorDragEnd}
      />
    </Group>
  );
}

Edge.propTypes = {
  id: PropTypes.number.isRequired,
  nodes: PropTypes.arrayOf(PropTypes.shape({
    pieces: PropTypes.arrayOf(PropTypes.string),
    x: PropTypes.number,
    y: PropTypes.number,
    type: PropTypes.string,
    value: PropTypes.string,
    isFinal: PropTypes.bool,
  })),
  childNodeId: PropTypes.number.isRequired,
  parentNodeId: PropTypes.number.isRequired,
  parentPieceId: PropTypes.number.isRequired,
  isDragged: PropTypes.bool,
  isFullDisabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  isDraggingSelectionRect: PropTypes.bool,
  currentErrorLocation: PropTypes.shape({
    edge: PropTypes.string,
    edgeId: PropTypes.string,
  }),
  nodePaddingX: PropTypes.number,
  nodePaddingY: PropTypes.number,
  handleEdgeClick: PropTypes.func,
  handleConnectorDragStart: PropTypes.func,
  setCursor: PropTypes.func,
  placeholderWidth: PropTypes.number.isRequired,
  fontSize: PropTypes.number,
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
  }),
};

Edge.defaultProps = {
  nodes: [],
  isDragged: false,
  isFullDisabled: false,
  isSelected: false,
  isDraggingSelectionRect: false,
  currentErrorLocation: null,
  nodePaddingX: defaultStyle.node.paddingX,
  nodePaddingY: defaultStyle.node.paddingY,
  handleEdgeClick: () => {},
  handleConnectorDragStart: () => {},
  setCursor: () => {},
  fontSize: defaultStyle.fontSize,
  style: defaultStyle.edge,
};

export default Edge;
