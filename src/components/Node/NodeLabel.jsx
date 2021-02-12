import React from 'react';
import PropTypes from 'prop-types';

import {
  Circle,
  Group,
  Rect,
  Text,
} from 'react-konva';

import {
  edgeByParentPiece,
} from '../../utils/tree';

function NodeLabel({
  nodeId,
  connectorPlaceholder,
  labelPieces,
  labelPiecesPosition,
  nodeHeight,
  edges,
  currentErrorLocation,
  isFullDisabled,
  handlePlaceholderConnectorDragStart,
  setCursor,
  fontFamily,
  fontSize,
  nodeStyle,
  connectorStyle,
}) {
  const { paddingX, paddingY } = nodeStyle;
  const { width: placeholderWidth } = nodeStyle.placeholder;

  const computePlaceholderPieceKey = (index) => `PlaceholderPiece-${nodeId}-${index}`;
  const computeTextPieceKey = (index) => `TextPiece-${nodeId}-${index}`;

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
  const computeColor = (index, stl) => {
    if (currentErrorLocation
        && currentErrorLocation.pieceConnector
        && currentErrorLocation.nodeId === nodeId
        && currentErrorLocation.pieceId === index) {
      return stl.errorColor;
    }

    return stl.placeholder.fillColor;
  };

  return (
    <Group>
      {labelPieces.map((pieceText, i) => (pieceText === connectorPlaceholder ? (
        <Group key={computePlaceholderPieceKey(i)}>
          <Rect
            id={i}
            x={paddingX + labelPiecesPosition[i]}
            y={nodeHeight / 2 - paddingY}
            width={placeholderWidth}
            height={fontSize}
            fill={computeColor(i, nodeStyle)}
            stroke={nodeStyle.placeholder.strokeColor}
            strokeWidth={nodeStyle.placeholder.strokeSize}
            cornerRadius={nodeStyle.placeholder.radius}
            draggable={!isFullDisabled}
            onDragStart={(e) => handlePlaceholderConnectorDragStart(e, nodeId)}
            onTouchStart={(e) => handlePlaceholderConnectorDragStart(e, nodeId)}
            onMouseOver={handleMouseOver}
            onDragMove={() => {}}
            onDragEnd={() => {}}
          />
          <Circle
            id={i}
            x={paddingX + labelPiecesPosition[i] + placeholderWidth / 2}
            y={paddingY + fontSize / 2}
            draggable={!isFullDisabled}
            onDragStart={(e) => handlePlaceholderConnectorDragStart(e, nodeId)}
            onTouchStart={((e) => handlePlaceholderConnectorDragStart(e, nodeId))}
            radius={connectorStyle.parent.radiusSize}
            fill={connectorStyle.parent.color}
            stroke={connectorStyle.parent.strokeColor}
            strokeWidth={connectorStyle.parent.strokeSize}
            onMouseOver={handleMouseOver}
            onDragMove={() => {}}
            onDragEnd={() => {}}
            visible={edgeByParentPiece(nodeId, i, edges).length > 0}
          />
        </Group>
      ) : (
        <Text
          key={computeTextPieceKey(i)}
          x={paddingX + labelPiecesPosition[i]}
          y={paddingY}
          fill={nodeStyle.textColor}
          fontFamily={fontFamily}
          fontSize={fontSize}
          text={pieceText}
          listening={false}
          onDragMove={() => {}}
          onDragEnd={() => {}}
        />
      )))}
    </Group>
  );
}

NodeLabel.propTypes = {
  nodeId: PropTypes.number.isRequired,
  connectorPlaceholder: PropTypes.string.isRequired,
  labelPieces: PropTypes.arrayOf(PropTypes.string).isRequired,
  labelPiecesPosition: PropTypes.arrayOf(PropTypes.number).isRequired,
  nodeHeight: PropTypes.number.isRequired,
  edges: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)).isRequired,
  currentErrorLocation: PropTypes.shape({
    pieceConnector: PropTypes.string,
    nodeId: PropTypes.string,
    pieceId: PropTypes.number,
  }).isRequired,
  isFullDisabled: PropTypes.bool.isRequired,
  handlePlaceholderConnectorDragStart: PropTypes.func.isRequired,
  setCursor: PropTypes.func.isRequired,
  fontSize: PropTypes.number.isRequired,
  fontFamily: PropTypes.string.isRequired,
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
  }).isRequired,
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
  }).isRequired,
};

NodeLabel.defaultProps = {};

export default NodeLabel;
