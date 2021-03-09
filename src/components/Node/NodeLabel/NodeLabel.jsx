import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import {
  Circle,
  Group,
  Rect,
  Text,
} from 'react-konva';

import defaultStyle from '../../../style/default.json';

function NodeLabel({
  nodeId,
  connectorPlaceholder,
  labelPieces,
  labelPiecesPosition,
  nodeHeight,
  currentErrorLocation,
  hasOutgoingEdges,
  isFullDisabled,
  handlePlaceholderConnectorDragStart,
  handleConnectorDragMove,
  handleConnectorDragEnd,
  setCursor,
  fontFamily,
  fontSize,
  nodeStyle,
  connectorStyle,
}) {
  const rectRef = useRef([]);
  const circleRef = useRef([]);

  const { paddingX, paddingY } = nodeStyle;
  const { width: placeholderWidth } = nodeStyle.placeholder;

  const positions = useMemo(() => (labelPieces.map((pieceText, i) => {
    if (pieceText === connectorPlaceholder) {
      return {
        x: paddingX + labelPiecesPosition[i],
        y: nodeHeight / 2 - paddingY,
        circleX: paddingX + labelPiecesPosition[i] + placeholderWidth / 2,
        circleY: paddingY + fontSize / 2,
      };
    }
    return {
      x: paddingX + labelPiecesPosition[i],
      y: paddingY,
    };
  })), [
    labelPieces,
    labelPiecesPosition,
    nodeHeight,
    connectorPlaceholder,
    fontSize,
    placeholderWidth,
    paddingX,
    paddingY,
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
            ref={(element) => { rectRef.current[i] = element; }}
            id={i}
            x={positions[i].x}
            y={positions[i].y}
            width={placeholderWidth}
            height={fontSize}
            fill={computeColor(i, nodeStyle)}
            stroke={nodeStyle.placeholder.strokeColor}
            strokeWidth={nodeStyle.placeholder.strokeSize}
            cornerRadius={nodeStyle.placeholder.radius}
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
            radius={connectorStyle.parent.radiusSize}
            fill={connectorStyle.parent.color}
            stroke={connectorStyle.parent.strokeColor}
            strokeWidth={connectorStyle.parent.strokeSize}
            onMouseOver={handleMouseOver}
            visible={hasOutgoingEdges[i]}
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
  currentErrorLocation: PropTypes.shape({
    pieceConnector: PropTypes.string,
    nodeId: PropTypes.string,
    pieceId: PropTypes.number,
  }),
  hasOutgoingEdges: PropTypes.arrayOf(PropTypes.bool),
  isFullDisabled: PropTypes.bool,
  handlePlaceholderConnectorDragStart: PropTypes.func,
  handleConnectorDragMove: PropTypes.func,
  handleConnectorDragEnd: PropTypes.func,
  setCursor: PropTypes.func,
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

NodeLabel.defaultProps = {
  currentErrorLocation: null,
  hasOutgoingEdges: [],
  isFullDisabled: false,
  handlePlaceholderConnectorDragStart: () => {},
  handleConnectorDragMove: () => {},
  handleConnectorDragEnd: () => {},
  setCursor: () => {},
  fontSize: defaultStyle.fontSize,
  fontFamily: defaultStyle.fontFamily,
  nodeStyle: defaultStyle.node,
  connectorStyle: defaultStyle.edge.connector,
};

export default NodeLabel;
