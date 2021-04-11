import React, {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  Group,
  Rect,
} from 'react-konva';

import NodeLabel from '../Node/NodeLabel/NodeLabel';
import NodeDeleteButton from '../Node/NodeDeleteButton/NodeDeleteButton';
import NodeTopConnector from '../Node/NodeTopConnector/NodeTopConnector';
import NodeTypeValue from '../Node/NodeTypeValue/NodeTypeValue';

function NodeSample({
  id,
  labelPieces,
  labelPiecesPosition,
  positionX,
  positionY,
  typeText,
  valueText,
  connectorPlaceholder,
  nodeWidth,
  nodeHeight,
  isFinal,
  isSelected,
  fontSize,
  fontFamily,
  nodeStyle,
  connectorStyle,
}) {
  const { paddingY } = nodeStyle;

  /**
   *
   * Compute node color given a style object
   *
   * @param {Object} stl
   */
  const computeColor = (stl) => {
    if (isSelected) {
      return stl.selectedColor;
    }
    if (isFinal) {
      return stl.finalColor;
    }
    return stl.fillColor;
  };

  return (
    /**
     * A node is a groupd composed by:
     *  - Reactangle: the box surrounding the node
     *  - NodeTopConnector: the circle on the top edge, used for connect Edges
     *  - NodeLabel: the content of the node
     *  - NodeDeleteButton: the button for removing the node
     */
    <Group
      key={`Node-${id}`}
      nodeId={id}
      x={positionX}
      y={positionY}
      draggable
    >
      <Rect
        name="Node"
        id={id}
        key={`NodeRect-${id}`}
        width={nodeWidth}
        height={nodeHeight}
        fill={computeColor(nodeStyle)}
        stroke={nodeStyle.strokeColor}
        strokeWidth={isSelected ? nodeStyle.strokeSelectedWidth : nodeStyle.strokeWidth}
        cornerRadius={nodeStyle.radius}
      />
      <NodeTopConnector
        nodeId={id}
        nodeWidth={nodeWidth}
        isSelected={isSelected}
        nodeStyle={nodeStyle}
        connectorStyle={connectorStyle}
      />
      <NodeLabel
        nodeId={id}
        connectorPlaceholder={connectorPlaceholder}
        labelPieces={labelPieces}
        labelPiecesPosition={labelPiecesPosition}
        nodeHeight={nodeHeight}
        isSelected={isSelected}
        fontFamily={fontFamily}
        fontSize={fontSize}
        nodeStyle={nodeStyle}
        connectorStyle={connectorStyle}
      />
      <NodeDeleteButton
        nodeId={id}
        nodeWidth={nodeWidth}
        isFinal={isFinal}
        fontFamily={fontFamily}
        style={nodeStyle.delete}
      />
      <NodeTypeValue
        typeText={typeText}
        valueText={valueText}
        nodeWidth={nodeWidth}
        fontFamily={fontFamily}
        style={nodeStyle.typeValue}
      />
    </Group>
  );
}

NodeSample.propTypes = {
  id: PropTypes.number.isRequired,
  labelPieces: PropTypes.arrayOf(PropTypes.string).isRequired,
  positionX: PropTypes.number.isRequired,
  positionY: PropTypes.number.isRequired,
  typeText: PropTypes.string,
  valueText: PropTypes.string,
  connectorPlaceholder: PropTypes.string.isRequired,
  nodeWidth: PropTypes.number.isRequired,
  isFinal: PropTypes.bool,
  isSelected: PropTypes.bool,
  fontSize: PropTypes.number,
  fontFamily: PropTypes.string,
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

NodeSample.defaultProps = {
  typeText: '',
  valueText: '',
  isFinal: false,
  isSelected: false,
  // fontSize: defaultStyle.fontSize,
  // fontFamily: defaultStyle.fontFamily,
  // nodeStyle: defaultStyle.node,
  // connectorStyle: defaultStyle.edge.connector,
};

export default NodeSample;
