import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import {
  Circle,
  Group,
  Rect,
  Text,
} from 'react-konva';

function NodeLabel({
  nodeId,
  connectorPlaceholder,
  labelPieces,
  labelPiecesPosition,
  nodeHeight,
  currentErrorLocation,
  hasParentEdges,
  isFullDisabled,
  handlePlaceholderConnectorDragStart,
  handleConnectorDragMove,
  handleConnectorDragEnd,
  setCursor,
  fontFamily,
  fontSize,
  nodePaddingX,
  nodePaddingY,
  placeholderWidth,
  nodeTextColor,
  placeholderStrokeWidth,
  placeholderStrokeColor,
  placeholderFillColor,
  placeholderErrorColor,
  placeholderRadius,
  connectorRadiusSize,
  connectorStrokeWidth,
  connectorFillColor,
  connectorStrokeColor,
}) {
  const rectRef = useRef([]);
  const circleRef = useRef([]);

  const positions = useMemo(() => (labelPieces.map((pieceText, i) => {
    if (pieceText === connectorPlaceholder) {
      return {
        x: nodePaddingX + labelPiecesPosition[i],
        y: nodeHeight / 2 - nodePaddingY,
        circleX: nodePaddingX + labelPiecesPosition[i] + placeholderWidth / 2,
        circleY: nodePaddingY + fontSize / 2,
      };
    }
    return {
      x: nodePaddingX + labelPiecesPosition[i],
      y: nodePaddingY,
    };
  })), [
    labelPieces,
    labelPiecesPosition,
    nodeHeight,
    connectorPlaceholder,
    fontSize,
    placeholderWidth,
    nodePaddingX,
    nodePaddingY,
  ]);

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
  const computeColor = (defaultColor, errorColor, index) => {
    if (currentErrorLocation
        && currentErrorLocation.pieceConnector
        && currentErrorLocation.nodeId === nodeId
        && currentErrorLocation.pieceId === index) {
      return errorColor;
    }

    return defaultColor;
  };

  return (
    <Group>
      {labelPieces.map((pieceText, i) => (pieceText === connectorPlaceholder ? (
        <Group key={computePlaceholderPieceKey(i)}>
          <Rect
            ref={(element) => { rectRef.current[i] = element; }}
            id={i}
            x={positions[i].x}
            y={positions[i].y}
            width={placeholderWidth}
            height={fontSize}
            fill={computeColor(placeholderFillColor, placeholderErrorColor, i)}
            stroke={placeholderStrokeColor}
            strokeWidth={placeholderStrokeWidth}
            cornerRadius={placeholderRadius}
            draggable={!isFullDisabled}
            onMouseOver={handleMouseOver}
            onDragStart={(e) => handlePlaceholderConnectorDragStart(e, nodeId)}
            onTouchStart={(e) => handlePlaceholderConnectorDragStart(e, nodeId)}
            onDragMove={handleConnectorDragMove}
            onDragEnd={handleConnectorDragEnd}
            dragBoundFunc={() => rectRef.current[i].getAbsolutePosition()}
          />
          <Circle
            ref={(element) => { circleRef.current[i] = element; }}
            id={i}
            x={positions[i].circleX}
            y={positions[i].circleY}
            draggable={!isFullDisabled}
            radius={connectorRadiusSize}
            fill={connectorFillColor}
            stroke={connectorStrokeColor}
            strokeWidth={connectorStrokeWidth}
            onMouseOver={handleMouseOver}
            visible={hasParentEdges[i]}
            onDragStart={(e) => handlePlaceholderConnectorDragStart(e, nodeId)}
            onTouchStart={((e) => handlePlaceholderConnectorDragStart(e, nodeId))}
            onDragMove={handleConnectorDragMove}
            onDragEnd={handleConnectorDragEnd}
            dragBoundFunc={() => circleRef.current[i].getAbsolutePosition()}
          />
        </Group>
      ) : (
        <Text
          key={computeTextPieceKey(i)}
          x={positions[i].x}
          y={positions[i].y}
          fill={nodeTextColor}
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
  currentErrorLocation: PropTypes.shape({
    pieceConnector: PropTypes.string,
    nodeId: PropTypes.string,
    pieceId: PropTypes.number,
  }),
  hasParentEdges: PropTypes.arrayOf(PropTypes.bool),
  isFullDisabled: PropTypes.bool,
  handlePlaceholderConnectorDragStart: PropTypes.func,
  handleConnectorDragMove: PropTypes.func,
  handleConnectorDragEnd: PropTypes.func,
  setCursor: PropTypes.func,
  fontSize: PropTypes.number,
  fontFamily: PropTypes.string,
  nodePaddingX: PropTypes.number,
  nodePaddingY: PropTypes.number,
  nodeTextColor: PropTypes.string,
  placeholderWidth: PropTypes.number,
  placeholderStrokeWidth: PropTypes.number,
  placeholderStrokeColor: PropTypes.string,
  placeholderFillColor: PropTypes.string,
  placeholderErrorColor: PropTypes.string,
  placeholderRadius: PropTypes.number,
  connectorRadiusSize: PropTypes.number,
  connectorStrokeWidth: PropTypes.number,
  connectorFillColor: PropTypes.string,
  connectorStrokeColor: PropTypes.string,
};

NodeLabel.defaultProps = {
  currentErrorLocation: null,
  hasParentEdges: [],
  isFullDisabled: false,
  handlePlaceholderConnectorDragStart: () => {},
  handleConnectorDragMove: () => {},
  handleConnectorDragEnd: () => {},
  setCursor: () => {},
  fontSize: 24,
  fontFamily: 'Roboto Mono, Courier',
  nodePaddingX: 12,
  nodePaddingY: 12,
  nodeTextColor: '#FFFFFF',
  placeholderWidth: 16,
  placeholderStrokeWidth: 0,
  placeholderStrokeColor: '#000000',
  placeholderFillColor: '#104020',
  placeholderErrorColor: '#FF0000',
  placeholderRadius: 3,
  connectorRadiusSize: 6,
  connectorStrokeWidth: 0,
  connectorFillColor: '#000000',
  connectorStrokeColor: '#000000',
};

export default NodeLabel;
