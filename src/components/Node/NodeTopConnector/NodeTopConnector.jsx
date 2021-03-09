import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Circle,
  Group,
  Star,
} from 'react-konva';

import defaultStyle from '../../../style/default.json';

function NodeTopConnector({
  nodeId,
  nodeWidth,
  currentErrorLocation,
  hasIncomingEdge,
  isSelectedRoot,
  isFullDisabled,
  isSelected,
  handleNodeConnectorDragStart,
  handleConnectorDragMove,
  handleConnectorDragEnd,
  setCursor,
  nodeStyle,
  connectorStyle,
}) {
  const starRef = useRef();
  const circleRef = useRef();

  const x = useMemo(() => nodeWidth / 2, [nodeWidth]);

  const handleMouseOver = (e) => {
    if (isFullDisabled) {
      return;
    }

    e.cancelBubble = true;
    setCursor('grab');
  };

  /**
   * Compute connector color given a style object
   * @param {Object} stl
   */
  const computeColor = (stl) => {
    if (currentErrorLocation
      && currentErrorLocation.nodeConnector
      && currentErrorLocation.nodeId === nodeId) {
      return stl.errorColor;
    }
    if (isSelected) {
      return stl.selectedColor;
    }
    if (hasIncomingEdge) {
      return stl.color;
    }
    return stl.emptyColor;
  };

  return (
    <Group>
      {isSelectedRoot ? (
        <Star
          key={`NodeConnector-${nodeId}`}
          ref={starRef}
          id={nodeId}
          x={x}
          y={0}
          numPoints={nodeStyle.star.numPoints}
          innerRadius={nodeStyle.star.innerRadius}
          outerRadius={nodeStyle.star.outerRadius}
          fill={computeColor(connectorStyle.child)}
          stroke={nodeStyle.star.strokeColor}
          strokeWidth={nodeStyle.star.strokeSize}
          draggable={!isFullDisabled}
          onMouseOver={handleMouseOver}
          onTouchStart={handleNodeConnectorDragStart}
          onDragStart={handleNodeConnectorDragStart}
          onDragMove={handleConnectorDragMove}
          onDragEnd={handleConnectorDragEnd}
          dragBoundFunc={() => starRef.current.getAbsolutePosition()}
        />
      ) : (
        <Circle
          key={`NodeConnector-${nodeId}`}
          ref={circleRef}
          id={nodeId}
          x={x}
          y={0}
          radius={connectorStyle.child.radiusSize}
          fill={computeColor(connectorStyle.child)}
          stroke={connectorStyle.child.strokeColor}
          strokeWidth={connectorStyle.child.strokeSize}
          draggable={!isFullDisabled}
          onMouseOver={handleMouseOver}
          onDragStart={handleNodeConnectorDragStart}
          onTouchStart={handleNodeConnectorDragStart}
          onDragMove={handleConnectorDragMove}
          onDragEnd={handleConnectorDragEnd}
          dragBoundFunc={() => circleRef.current.getAbsolutePosition()}
        />
      )}
    </Group>
  );
}

NodeTopConnector.propTypes = {
  nodeId: PropTypes.number.isRequired,
  nodeWidth: PropTypes.number.isRequired,
  currentErrorLocation: PropTypes.shape({
    nodeConnector: PropTypes.string,
    nodeId: PropTypes.string,
  }),
  hasIncomingEdge: PropTypes.bool,
  isSelectedRoot: PropTypes.bool,
  isFullDisabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  setCursor: PropTypes.func,
  handleNodeConnectorDragStart: PropTypes.func,
  handleConnectorDragMove: PropTypes.func,
  handleConnectorDragEnd: PropTypes.func,
  nodeStyle: PropTypes.exact({
    paddingX: PropTypes.number,
    paddingY: PropTypes.number,
    radius: PropTypes.number,
    strokeColor: PropTypes.string,
    strokeWidth: PropTypes.number,
    strokeSelectedWidth: PropTypes.number,
    fillColor: PropTypes.string,
    errorColor: PropTypes.string,
    selectedColor: PropTypes.string,
    finalColor: PropTypes.string,
    textColor: PropTypes.string,
    deleteButtonColor: PropTypes.string,
    placeholder: PropTypes.exact({
      width: PropTypes.number,
      strokeSize: PropTypes.number,
      strokeColor: PropTypes.string,
      fillColor: PropTypes.string,
      radius: PropTypes.number,
    }),
    star: PropTypes.exact({
      strokeSize: PropTypes.number,
      strokeColor: PropTypes.string,
      numPoints: PropTypes.number,
      innerRadius: PropTypes.number,
      outerRadius: PropTypes.number,
    }),
    delete: PropTypes.exact({
      paddingX: PropTypes.number,
      paddingY: PropTypes.number,
      fontSize: PropTypes.number,
      text: PropTypes.string,
      textColor: PropTypes.string,
      overTextColor: PropTypes.string,
    }),
    typeValue: PropTypes.exact({
      fontSize: PropTypes.number,
      fillColor: PropTypes.string,
      strokeColor: PropTypes.string,
      strokeSize: PropTypes.string,
      pointerDirection: PropTypes.string,
      pointerWidth: PropTypes.number,
      pointerHeight: PropTypes.number,
      radius: PropTypes.number,
      textColor: PropTypes.string,
      padding: PropTypes.number,
    }),
  }),
  connectorStyle: PropTypes.exact({
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
};

NodeTopConnector.defaultProps = {
  currentErrorLocation: null,
  hasIncomingEdge: false,
  isSelectedRoot: false,
  isFullDisabled: false,
  isSelected: false,
  setCursor: () => {},
  handleNodeConnectorDragStart: () => {},
  handleConnectorDragMove: () => {},
  handleConnectorDragEnd: () => {},
  nodeStyle: defaultStyle.node,
  connectorStyle: defaultStyle.edge.connector,
};

export default NodeTopConnector;
