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
} from '../utils';

function NodeLabel({
  nodeId,
  connectorPlaceholder,
  placeholderWidth,
  labelPieces,
  labelPiecesPosition,
  textHeight,
  nodeHeight,
  edges,
  currentErrorLocation,
  isFullDisabled,
  handlePlaceholderConnectorDragStart,
  fontFamily,
  fontSize,
  nodeStyle,
  connectorStyle,
}) {
  const { paddingX, paddingY } = nodeStyle;

  const computePlaceholderPieceKey = (index) => `PlaceholderPiece-${nodeId}-${index}`;
  const computeTextPieceKey = (index) => `TextPiece-${nodeId}-${index}`;

  return (
    <Group>
      {labelPieces.map((p, i) => (p === connectorPlaceholder ? (
        <Group key={computePlaceholderPieceKey(i)}>
          <Rect
            id={i}
            x={paddingX + labelPiecesPosition[i]}
            y={nodeHeight / 2 - paddingY}
            width={placeholderWidth}
            height={textHeight}
            fill={
                currentErrorLocation
                && currentErrorLocation.pieceConnector
                && currentErrorLocation.nodeId === nodeId
                && currentErrorLocation.pieceId === i
                  ? nodeStyle.errorColor
                  : nodeStyle.placeholderColor
              }
            stroke="black"
            strokeWidth={1}
            cornerRadius={3}
            draggable={!isFullDisabled}
            onDragStart={
                !isFullDisabled && ((e) => handlePlaceholderConnectorDragStart(e, nodeId))
              }
            onTouchStart={
                !isFullDisabled && ((e) => handlePlaceholderConnectorDragStart(e, nodeId))
              }
            onMouseOver={
                !isFullDisabled
                && ((e) => {
                  e.cancelBubble = true;
                  document.body.style.cursor = 'grab';
                })
              }
            onDragMove={() => {}}
            onDragEnd={() => {}}
          />
          <Circle
            id={i}
            x={paddingX + labelPiecesPosition[i] + placeholderWidth / 2}
            y={paddingY + textHeight / 2}
            draggable={!isFullDisabled}
            onDragStart={
              !isFullDisabled && ((e) => handlePlaceholderConnectorDragStart(e, nodeId))
            }
            onTouchStart={
              !isFullDisabled && ((e) => handlePlaceholderConnectorDragStart(e, nodeId))
            }
            radius={fontSize / 4}
            fill={connectorStyle.parent.color}
            stroke="black"
            strokeWidth={1}
            onMouseOver={
                !isFullDisabled
                && ((e) => {
                  e.cancelBubble = true;
                  document.body.style.cursor = 'grab';
                })
              }
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
          text={p}
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
  placeholderWidth: PropTypes.number.isRequired,
  labelPieces: PropTypes.arrayOf(PropTypes.string).isRequired,
  labelPiecesPosition: PropTypes.arrayOf(PropTypes.number).isRequired,
  textHeight: PropTypes.number.isRequired,
  nodeHeight: PropTypes.number.isRequired,
  edges: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)).isRequired,
  currentErrorLocation: PropTypes.shape({
    pieceConnector: PropTypes.string,
    nodeId: PropTypes.string,
    pieceId: PropTypes.number,
  }).isRequired,
  isFullDisabled: PropTypes.bool.isRequired,
  handlePlaceholderConnectorDragStart: PropTypes.func.isRequired,
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
    placeholderColor: PropTypes.string,
    tagColor: PropTypes.string,
    textColor: PropTypes.string,
    deleteButtonColor: PropTypes.string,
    star: PropTypes.exact({
      strokeSize: PropTypes.number,
      strokeColor: PropTypes.string,
      numPoints: PropTypes.number,
      innerRadius: PropTypes.number,
      outerRadius: PropTypes.number,
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
