import React, {
  useState,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  Group,
  Rect,
} from 'react-konva';

import NodeLabel from './NodeLabel';
import NodeDeleteButton from './NodeDeleteButton';
import NodeTopConnector from './NodeTopConnector';
import NodeTypeValue from './NodeTypeValue';

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
  transformerRef,
  selectedEdgeRef,
  setSelectedEdgeRef,
  nodeWidth,
  edges,
  currentErrorLocation,
  moveNodeTo,
  moveNodeToEnd,
  removeNode,
  clearNodeSelection,
  clearEdgeSelection,
  computeLabelPiecesXCoordinatePositions,
  setCursor,
  isDraggingSelectionRect,
  isFinal,
  isSelected,
  isSelectedRoot,
  isPressingMetaOrShift,
  isFullDisabled,
  onNodeMove,
  onNodeDelete,
  onNodeClick,
  onNodeDblClick,
  onNodeConnectorDragStart,
  onPlaceholderConnectorDragStart,
  fontSize,
  fontFamily,
  nodeStyle,
  connectorStyle,
}) {
  const { paddingX, paddingY } = nodeStyle;
  // State hook to keep track when we are dragging a node
  // and not from a node/placeholder connector
  const [draggingNode, setDraggingNode] = useState(false);

  const nodeHeight = useMemo(
    () => 2 * nodeStyle.paddingY + fontSize,
    [paddingY, fontSize],
  );

  const labelPiecesPosition = useMemo(() => computeLabelPiecesXCoordinatePositions(
    labelPieces,
  ), [labelPieces]);

  // Handle drag start event of a node, if a meta key is not being pressed,
  // set up the state for node drag move event, otherwise stop the node drag
  const handleDragStart = (e) => {
    if (!isPressingMetaOrShift) {
      transformerRef.current.nodes([]);
      e.currentTarget.moveToTop();
      setDraggingNode(true);
      if (selectedEdgeRef) {
        selectedEdgeRef.moveToBottom();
        setSelectedEdgeRef(null);
        clearEdgeSelection();
      }
    } else {
      e.target.stopDrag();
    }
  };

  // Handle node drag move events, updating the node position to the event coordinates
  const handleDragMove = (e) => {
    e.cancelBubble = true;
    if (draggingNode) {
      const x = e.target.x();
      const y = e.target.y();
      moveNodeTo({ nodeId: id, x, y });
    }
  };

  /**
   * Handle node drag move events,
   * updating the node position to the final event coordinates
   * (different action to be able to filter all the
   * previous moving actions to allow undo/redo working)
   */
  const handleDragEnd = (e) => {
    e.cancelBubble = true;
    setCursor('pointer');
    if (draggingNode) {
      const x = e.target.x();
      const y = e.target.y();
      moveNodeToEnd({
        nodeId: id, x, y, onNodeMove,
      });
    }
    setDraggingNode(false);
  };

  // Handle node click event, selecting the target node if a meta key is not being pressed
  const handleNodeClick = (e) => {
    if (!isPressingMetaOrShift) {
      e.cancelBubble = true;
      transformerRef.current.nodes([]);
      onNodeClick(e);
    }
  };

  // Handle drag start event from a placeholder connector,
  // starting drag event from the placeholder connector if a meta key is not being pressed,
  // otherwise stop the placeholder connector drag
  const handlePlaceholderConnectorDragStart = (e, nodeId) => {
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
      const pieceId = e.target.id();

      // we don't want the connector to be moved
      e.target.stopDrag();
      // but we want to initiate the moving around of the connection
      onPlaceholderConnectorDragStart(
        nodeId,
        pieceId,
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
      );
    } else {
      e.target.stopDrag();
    }
  };

  // Check the stage bounds to prevent manually dragging nodes outside the viewport
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
      onClick={!isFullDisabled && handleNodeClick}
      onTap={!isFullDisabled && handleNodeClick}
      onDblClick={!isFullDisabled && onNodeDblClick}
      onDblTap={!isFullDisabled && onNodeDblClick}
      onDragStart={!isFullDisabled && ((e) => handleDragStart(e))}
      onTouchStart={!isFullDisabled && ((e) => handleDragStart(e))}
      onDragMove={!isFullDisabled && handleDragMove}
      onTouchMove={!isFullDisabled && handleDragMove}
      onDragEnd={!isFullDisabled && handleDragEnd}
      onTouchEnd={!isFullDisabled && handleDragEnd}
      dragBoundFunc={(pos) => checkDragBound(pos)}
      onMouseOver={
        !isFullDisabled
        && ((e) => {
          e.cancelBubble = true;
          setCursor('pointer');
        })
      }
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
        edges={edges}
        nodeWidth={nodeWidth}
        currentErrorLocation={currentErrorLocation}
        isSelectedRoot={isSelectedRoot}
        isFullDisabled={isFullDisabled}
        isSelected={isSelected}
        selectedEdgeRef={selectedEdgeRef}
        setSelectedEdgeRef={setSelectedEdgeRef}
        clearEdgeSelection={clearEdgeSelection}
        transformerRef={transformerRef}
        onNodeConnectorDragStart={onNodeConnectorDragStart}
        setCursor={setCursor}
        nodeStyle={nodeStyle}
        connectorStyle={connectorStyle}
      />
      <NodeLabel
        nodeId={id}
        connectorPlaceholder={connectorPlaceholder}
        placeholderWidth={placeholderWidth}
        labelPieces={labelPieces}
        labelPiecesPosition={labelPiecesPosition}
        nodeHeight={nodeHeight}
        edges={edges}
        currentErrorLocation={currentErrorLocation}
        isFullDisabled={isFullDisabled}
        handlePlaceholderConnectorDragStart={handlePlaceholderConnectorDragStart}
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
        selectedEdgeRef={selectedEdgeRef}
        setSelectedEdgeRef={setSelectedEdgeRef}
        clearEdgeSelection={clearEdgeSelection}
        clearNodeSelection={clearNodeSelection}
        transformerRef={transformerRef}
        removeNode={removeNode}
        onNodeDelete={onNodeDelete}
        setCursor={setCursor}
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
  typeText: PropTypes.string.isRequired,
  valueText: PropTypes.string.isRequired,
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
  }).isRequired,
  selectedEdgeRef: PropTypes.shape({
    moveToBottom: PropTypes.func,
  }).isRequired,
  setSelectedEdgeRef: PropTypes.func.isRequired,
  nodeWidth: PropTypes.number.isRequired,
  edges: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)).isRequired,
  currentErrorLocation: PropTypes.shape({
    node: PropTypes.string,
    nodeId: PropTypes.number,
  }).isRequired,
  moveNodeTo: PropTypes.func.isRequired,
  moveNodeToEnd: PropTypes.func.isRequired,
  removeNode: PropTypes.func.isRequired,
  clearNodeSelection: PropTypes.func.isRequired,
  clearEdgeSelection: PropTypes.func.isRequired,
  computeLabelPiecesXCoordinatePositions: PropTypes.func.isRequired,
  setCursor: PropTypes.func.isRequired,
  isDraggingSelectionRect: PropTypes.bool.isRequired,
  isFinal: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isSelectedRoot: PropTypes.bool.isRequired,
  isPressingMetaOrShift: PropTypes.bool.isRequired,
  isFullDisabled: PropTypes.bool.isRequired,
  onNodeMove: PropTypes.func,
  onNodeDelete: PropTypes.func,
  onNodeClick: PropTypes.func,
  onNodeDblClick: PropTypes.func,
  onNodeConnectorDragStart: PropTypes.func,
  onPlaceholderConnectorDragStart: PropTypes.func,
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

Node.defaultProps = {
  onNodeMove: null,
  onNodeDelete: null,
  onNodeClick: null,
  onNodeDblClick: null,
  onNodeConnectorDragStart: null,
  onPlaceholderConnectorDragStart: null,
};

export default Node;
