import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Circle,
  Group,
  Star,
} from 'react-konva';

import {
  edgeByChildNode,
} from '../../../utils/tree';

import defaultStyle from '../../../style/default.json';

function NodeTopConnector({
  nodeId,
  nodeWidth,
  edges,
  currentErrorLocation,
  isSelectedRoot,
  isFullDisabled,
  isPressingMetaOrShift,
  isSelected,
  selectedEdgeRef,
  setSelectedEdgeRef,
  clearEdgeSelection,
  transformerRef,
  onNodeConnectorDragStart,
  setCursor,
  nodeStyle,
  connectorStyle,
}) {
  const x = useMemo(() => nodeWidth / 2,
    [nodeWidth]);

  // Handle drag start event from a node connector,
  // starting drag event from the node connector if a meta key is not being pressed,
  // otherwise stop the node connector drag
  const handleNodeConnectorDragStart = (e) => {
    if (isFullDisabled) {
      return;
    }

    if (!isPressingMetaOrShift) {
      // prevent onDragStart of Group
      e.cancelBubble = true;
      transformerRef.current.nodes([]);
      if (selectedEdgeRef) {
        selectedEdgeRef.moveToBottom();
        setSelectedEdgeRef(null);
        clearEdgeSelection();
      }
      setCursor('grabbing');
      // we don't want the connector to be moved
      e.target.stopDrag();
      // but we want to initiate the moving around of the connection
      onNodeConnectorDragStart(
        nodeId,
        e.target.parent.parent.x() + e.target.parent.x() + (nodeWidth / 2),
        e.target.parent.parent.y() + e.target.parent.y(),
      );
    } else {
      e.target.stopDrag();
    }
  };

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
    if (edgeByChildNode(nodeId, edges).length > 0) {
      return stl.color;
    }
    return stl.emptyColor;
  };

  return (
    <Group>
      {isSelectedRoot ? (
        <Star
          key={`NodeConnector-${nodeId}`}
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
          onDragStart={handleNodeConnectorDragStart}
          onTouchStart={handleNodeConnectorDragStart}
          onMouseOver={handleMouseOver}
          onDragMove={() => {}}
          onDragEnd={() => {}}
        />
      ) : (
        <Circle
          key={`NodeConnector-${nodeId}`}
          id={nodeId}
          x={x}
          y={0}
          radius={connectorStyle.child.radiusSize}
          fill={computeColor(connectorStyle.child)}
          stroke={connectorStyle.child.strokeColor}
          strokeWidth={connectorStyle.child.strokeSize}
          draggable={!isFullDisabled}
          onDragStart={handleNodeConnectorDragStart}
          onTouchStart={handleNodeConnectorDragStart}
          onMouseOver={handleMouseOver}
          onDragMove={() => {}}
          onDragEnd={() => {}}
        />
      )}
    </Group>
  );
}

NodeTopConnector.propTypes = {
  nodeId: PropTypes.number.isRequired,
  nodeWidth: PropTypes.number.isRequired,
  edges: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)),
  currentErrorLocation: PropTypes.shape({
    nodeConnector: PropTypes.string,
    nodeId: PropTypes.string,
  }),
  isSelectedRoot: PropTypes.bool,
  isFullDisabled: PropTypes.bool,
  isPressingMetaOrShift: PropTypes.bool,
  isSelected: PropTypes.bool,
  selectedEdgeRef: PropTypes.shape({
    moveToBottom: PropTypes.func,
  }),
  setSelectedEdgeRef: PropTypes.func,
  clearEdgeSelection: PropTypes.func,
  transformerRef: PropTypes.shapre({
    current: PropTypes.shape({
      nodes: PropTypes.func,
    }),
  }),
  onNodeConnectorDragStart: PropTypes.func,
  setCursor: PropTypes.func,
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
  edges: [],
  currentErrorLocation: null,
  isSelectedRoot: false,
  isFullDisabled: false,
  isPressingMetaOrShift: false,
  isSelected: false,
  selectedEdgeRef: null,
  setSelectedEdgeRef: () => {},
  clearEdgeSelection: () => {},
  transformerRef: {},
  onNodeConnectorDragStart: () => {},
  setCursor: () => {},
  nodeStyle: defaultStyle.node,
  connectorStyle: defaultStyle.edge.connector,
};

export default NodeTopConnector;
