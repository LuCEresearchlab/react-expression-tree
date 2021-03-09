import React, {
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import {
  Group,
  Rect,
} from 'react-konva';

import {
  edgeByChildNode,
  edgeByParentPiece,
} from '../../utils/tree';

import NodeLabel from './NodeLabel/NodeLabel';
import NodeDeleteButton from './NodeDeleteButton/NodeDeleteButton';
import NodeTopConnector from './NodeTopConnector/NodeTopConnector';
import NodeTypeValue from './NodeTypeValue/NodeTypeValue';

import defaultStyle from '../../style/default.json';

function Node({
  id,
  labelPieces,
  positionX,
  positionY,
  typeText,
  valueText,
  connectorPlaceholder,
  placeholderWidth,
  stageRef,
  stageWidth,
  stageHeight,
  nodeWidth,
  edges,
  currentErrorLocation,
  removeNode,
  computeLabelPiecesXCoordinatePositions,
  setCursor,
  isDraggingSelectionRect,
  isFinal,
  isSelected,
  isSelectedRoot,
  isFullDisabled,
  handleNodeClick,
  handleNodeDblClick,
  handleNodeDragStart,
  handleNodeDragMove,
  handleNodeDragEnd,
  handleConnectorDragStart,
  handleConnectorDragMove,
  handleConnectorDragEnd,
  fontSize,
  fontFamily,
  nodeStyle,
  connectorStyle,
}) {
  const { paddingX, paddingY } = nodeStyle;

  const hasIncomingEdge = useMemo(
    () => (edgeByChildNode(id, edges).length > 0),
    [edges],
  );

  const hasOutgoingEdges = useMemo(
    () => (labelPieces.map((label, index) => (edgeByParentPiece(id, index, edges).length > 0))),
    [labelPieces, edges],
  );

  const nodeHeight = useMemo(
    () => 2 * nodeStyle.paddingY + fontSize,
    [paddingY, fontSize],
  );

  const labelPiecesPosition = useMemo(() => computeLabelPiecesXCoordinatePositions(
    labelPieces,
  ), [labelPieces]);

  const checkDragBound = (pos) => {
    const stageScale = stageRef.current.scale();
    let newX = pos.x;
    let newY = pos.y;
    if (pos.x < 0) {
      newX = 0;
    } else if (pos.x > stageWidth - nodeWidth * stageScale.x) {
      newX = stageWidth - nodeWidth * stageScale.x;
    }
    if (pos.y < 0) {
      newY = 0;
    } else if (pos.y > stageHeight - nodeHeight * stageScale.y) {
      newY = stageHeight - nodeHeight * stageScale.y;
    }
    return {
      x: newX,
      y: newY,
    };
  };

  const handlePlaceholderConnectorDragStart = useCallback((e, nodeId) => {
    e.cancelBubble = true;

    if (isFullDisabled) {
      return;
    }

    const pieceId = e.target.id();
    handleConnectorDragStart(
      true,
      nodeId,
      e.target.parent.parent.parent.x()
        + e.target.parent.parent.x()
        + e.target.parent.x()
        + paddingX
        + labelPiecesPosition[pieceId]
        + placeholderWidth / 2,
      e.target.parent.parent.parent.y()
        + e.target.parent.parent.y()
        + e.target.parent.y()
        + paddingY
        + fontSize / 2,
      pieceId,
    );
  });

  const handleTopNodeConnectorDragStart = useCallback((e) => {
    e.cancelBubble = true;

    if (isFullDisabled) {
      return;
    }

    handleConnectorDragStart(
      false,
      id,
      e.target.parent.parent.x() + e.target.parent.x() + (nodeWidth / 2),
      e.target.parent.parent.y() + e.target.parent.y(),
    );
  });

  const handleMouseOver = (e) => {
    e.cancelBubble = true;
    if (isFullDisabled) {
      return;
    }
    setCursor('pointer');
  };

  const handleMouseLeave = (e) => {
    e.cancelBubble = true;
    if (isFullDisabled) {
      return;
    }
    setCursor('default');
  };

  /**
   *
   * Compute node color given a style object
   *
   * @param {Object} stl
   */
  const computeColor = (stl) => {
    if (currentErrorLocation
      && currentErrorLocation.node
      && currentErrorLocation.nodeId === id) {
      return stl.errorColor;
    }
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
      draggable={!isFullDisabled}
      onClick={handleNodeClick}
      onTap={handleNodeClick}
      onDblClick={handleNodeDblClick}
      onDblTap={handleNodeDblClick}
      onDragStart={handleNodeDragStart}
      onTouchStart={handleNodeDragStart}
      onDragMove={handleNodeDragMove}
      onTouchMove={handleNodeDragMove}
      onDragEnd={handleNodeDragEnd}
      onTouchEnd={handleNodeDragEnd}
      dragBoundFunc={checkDragBound}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
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
        currentErrorLocation={currentErrorLocation}
        hasIncomingEdge={hasIncomingEdge}
        isSelectedRoot={isSelectedRoot}
        isFullDisabled={isFullDisabled}
        isSelected={isSelected}
        handleNodeConnectorDragStart={handleTopNodeConnectorDragStart}
        handleConnectorDragMove={handleConnectorDragMove}
        handleConnectorDragEnd={handleConnectorDragEnd}
        setCursor={setCursor}
        nodeStyle={nodeStyle}
        connectorStyle={connectorStyle}
      />
      <NodeLabel
        nodeId={id}
        connectorPlaceholder={connectorPlaceholder}
        labelPieces={labelPieces}
        labelPiecesPosition={labelPiecesPosition}
        nodeHeight={nodeHeight}
        currentErrorLocation={currentErrorLocation}
        hasOutgoingEdges={hasOutgoingEdges}
        isFullDisabled={isFullDisabled}
        handlePlaceholderConnectorDragStart={handlePlaceholderConnectorDragStart}
        handleConnectorDragMove={handleConnectorDragMove}
        handleConnectorDragEnd={handleConnectorDragEnd}
        setCursor={setCursor}
        fontFamily={fontFamily}
        fontSize={fontSize}
        nodeStyle={nodeStyle}
        connectorStyle={connectorStyle}
      />
      <NodeDeleteButton
        nodeId={id}
        nodeWidth={nodeWidth}
        isFinal={isFinal}
        isFullDisabled={isFullDisabled}
        isDraggingSelectionRect={isDraggingSelectionRect}
        removeNode={removeNode}
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

Node.propTypes = {
  id: PropTypes.number.isRequired,
  labelPieces: PropTypes.arrayOf(PropTypes.string).isRequired,
  positionX: PropTypes.number.isRequired,
  positionY: PropTypes.number.isRequired,
  typeText: PropTypes.string,
  valueText: PropTypes.string,
  connectorPlaceholder: PropTypes.string.isRequired,
  placeholderWidth: PropTypes.number.isRequired,
  stageRef: PropTypes.shape({
    current: PropTypes.shape({
      scale: PropTypes.func,
    }),
  }).isRequired,
  stageWidth: PropTypes.number.isRequired,
  stageHeight: PropTypes.number.isRequired,
  transformerRef: PropTypes.shape({
    current: PropTypes.shape({
      nodes: PropTypes.func,
    }),
  }),
  nodeWidth: PropTypes.number.isRequired,
  edges: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)),
  currentErrorLocation: PropTypes.shape({
    node: PropTypes.string,
    nodeId: PropTypes.number,
  }),
  removeNode: PropTypes.func,
  computeLabelPiecesXCoordinatePositions: PropTypes.func.isRequired,
  setCursor: PropTypes.func,
  isDraggingSelectionRect: PropTypes.bool,
  isFinal: PropTypes.bool,
  isSelected: PropTypes.bool,
  isSelectedRoot: PropTypes.bool,
  isFullDisabled: PropTypes.bool,
  handleNodeClick: PropTypes.func,
  handleNodeDblClick: PropTypes.func,
  handleNodeDragStart: PropTypes.func,
  handleNodeDragMove: PropTypes.func,
  handleNodeDragEnd: PropTypes.func,
  handleConnectorDragStart: PropTypes.func,
  handleConnectorDragMove: PropTypes.func,
  handleConnectorDragEnd: PropTypes.func,
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

Node.defaultProps = {
  typeText: '',
  valueText: '',
  transformerRef: null,
  edges: [],
  currentErrorLocation: null,
  isDraggingSelectionRect: false,
  isFinal: false,
  isSelected: false,
  isSelectedRoot: false,
  isFullDisabled: false,
  removeNode: () => {},
  setCursor: () => {},
  handleNodeClick: () => {},
  handleNodeDblClick: () => {},
  handleNodeDragStart: () => {},
  handleNodeDragMove: () => {},
  handleNodeDragEnd: () => {},
  handleConnectorDragStart: () => {},
  handleConnectorDragMove: () => {},
  handleConnectorDragEnd: () => {},
  fontSize: defaultStyle.fontSize,
  fontFamily: defaultStyle.fontFamily,
  nodeStyle: defaultStyle.node,
  connectorStyle: defaultStyle.edge.connector,
};

export default Node;
