import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Group,
  Label,
  Rect,
  Tag,
  Text,
} from 'react-konva';

import {
  computeLabelPiecesPositions,
} from '../utils';

import NodeLabel from './NodeLabel';
import TopConnector from './TopConnector';

function Node({
  id,
  labelPieces,
  positionX,
  positionY,

  nodeWidth,
  nodeHeight,
  type,
  value,
  isFinal,
  isSelected,
  isSelectedRoot,
  nodes,
  edges,
  transformerRef,
  selectedEdgeRef,
  setSelectedEdgeRef,
  draggingSelectionRect,
  currentErrorLocation,
  stageRef,
  stageWidth,
  stageHeight,
  isPressingMetaOrShift,
  textHeight,
  connectorPlaceholder,
  isFullDisabled,
  removeNode,
  clearNodeSelection,
  moveNodeTo,
  moveNodeToEnd,
  clearEdgeSelection,

  placeholderWidth,
  // Event Listeners
  onNodeMove,
  onNodeDelete,
  onNodeClick,
  onNodeDblClick,
  onNodeConnectorDragStart,
  onPlaceholderConnectorDragStart,
  // Style
  fontSize,
  fontFamily,
  nodeStyle,
  connectorStyle,
}) {
  // State hook to keep track when we are dragging a node
  // and not from a node/placeholder connector
  const [draggingNode, setDraggingNode] = useState(false);
  const [labelPiecesPosition, setLabelPiecesPosition] = useState(
    new Array(labelPieces.length).fill(0),
  );

  // Compute the positions of each node piece
  useEffect(() => {
    setLabelPiecesPosition(computeLabelPiecesPositions(
      labelPieces,
      connectorPlaceholder,
      fontSize,
      fontFamily,
    ));
  }, [labelPieces, connectorPlaceholder, fontSize, fontFamily]);

  const { paddingX, paddingY } = nodeStyle;

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

  // Handle node drag move events, updating the node position to the final event coordinates
  // (different action to be able to filter all the previous moving actions to allow undo/redo working)
  const handleDragEnd = (e) => {
    e.cancelBubble = true;
    document.body.style.cursor = 'pointer';
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
    if (!isPressingMetaOrShift) {
      // prevent onDragStart of Group
      e.cancelBubble = true;
      transformerRef.current.nodes([]);
      if (selectedEdgeRef) {
        selectedEdgeRef.moveToBottom();
        setSelectedEdgeRef(null);
        clearEdgeSelection();
      }
      document.body.style.cursor = 'grabbing';
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
          + textHeight / 2,
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

  // Handle node remove click
  const handleRemoveClick = (e) => {
    e.cancelBubble = true;
    transformerRef.current.nodes([]);
    document.body.style.cursor = 'move';
    if (selectedEdgeRef) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
      clearEdgeSelection();
    }
    clearNodeSelection();
    removeNode({
      nodeId: e.target.parent.attrs.id,
      onNodeDelete,
    });
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
    // A Node is a Group consisting in a Rect, an id Text, an "X" node deleting Text,
    // a Circle/Star node connector, zero or more Rect placeholder connectors (+ Circle if placeholder if already occupied),
    // one or more text labelPieces, and Label containing the node's selected type and value
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
          document.body.style.cursor = 'pointer';
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
      <TopConnector
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
        nodeStyle={nodeStyle}
        connectorStyle={connectorStyle}
      />
      <NodeLabel
        nodeId={id}
        connectorPlaceholder={connectorPlaceholder}
        placeholderWidth={placeholderWidth}
        labelPieces={labelPieces}
        labelPiecesPosition={labelPiecesPosition}
        textHeight={textHeight}
        nodeHeight={nodeHeight}
        edges={edges}
        currentErrorLocation={currentErrorLocation}
        isFullDisabled={isFullDisabled}
        handlePlaceholderConnectorDragStart={handlePlaceholderConnectorDragStart}
        fontFamily={fontFamily}
        fontSize={fontSize}
        nodeStyle={nodeStyle}
        connectorStyle={connectorStyle}
      />
      {!isFinal && !isFullDisabled && (
        <Text
          x={nodeWidth - paddingX}
          y={3}
          fill={nodeStyle.textColor}
          fontFamily={fontFamily}
          fontSize={fontSize / 2}
          text="X"
          name="deleteButton"
          onClick={handleRemoveClick}
          onTap={handleRemoveClick}
          onMouseOver={
            (e) => {
              if (!draggingSelectionRect) {
                e.cancelBubble = true;
                document.body.style.cursor = 'pointer';
                e.target.attrs.fill = nodeStyle.deleteButtonColor;
                e.target.draw();
              }
            }
          }
          onMouseLeave={(e) => {
            if (!draggingSelectionRect) {
              e.cancelBubble = true;
              e.target.attrs.fill = nodeStyle.textColor;
              e.target.draw();
            }
          }}
        />
      )}
      <Label x={nodeWidth / 2} y={-fontSize / 4}>
        <Tag
          fill={nodeStyle.tagColor}
          stroke="black"
          strokeWidth={type !== '' || value !== '' ? 1 : 0}
          pointerDirection="down"
          pointerWidth={type !== '' || value !== '' ? fontSize / 3 : 0}
          pointerHeight={type !== '' || value !== '' ? fontSize / 4 : 0}
          cornerRadius={3}
        />
        <Text
          fill={nodeStyle.textColor}
          fontFamily={fontFamily}
          fontSize={fontSize / 2}
          text={type + (type !== '' && value !== '' ? ': ' : '') + value}
          padding={type !== '' || value !== '' ? 5 : 0}
        />
      </Label>
    </Group>
  );
}

Node.propTypes = {
  id: PropTypes.number.isRequired,
  labelPieces: PropTypes.arrayOf(PropTypes.string).isRequired,
  positionX: PropTypes.number.isRequired,
  positionY: PropTypes.number.isRequired,

  nodeWidth: PropTypes.number,
  nodeHeight: PropTypes.number,
  type: PropTypes.string,
  value: PropTypes.string,
  isFinal: PropTypes.bool,
  isSelected: PropTypes.bool,
  isSelectedRoot: PropTypes.bool,
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      labelPieces: PropTypes.arrayOf(PropTypes.string),
      x: PropTypes.number,
      y: PropTypes.number,
      type: PropTypes.string,
      value: PropTypes.string,
      isFinal: PropTypes.bool,
    }),
  ),
  edges: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)),
  transformerRef: PropTypes.object,
  selectedEdgeRef: PropTypes.object,
  setSelectedEdgeRef: PropTypes.func,
  draggingSelectionRect: PropTypes.bool,
  currentErrorLocation: PropTypes.object,
  stageRef: PropTypes.object,
  stageWidth: PropTypes.number,
  stageHeight: PropTypes.number,
  isPressingMetaOrShift: PropTypes.bool,
  textHeight: PropTypes.number,
  isFullDisabled: PropTypes.bool,
  removeNode: PropTypes.func,
  clearNodeSelection: PropTypes.func,
  moveNodeTo: PropTypes.func,
  moveNodeToEnd: PropTypes.func,
  clearEdgeSelection: PropTypes.func,

  connectorPlaceholder: PropTypes.string.isRequired,
  placeholderWidth: PropTypes.number.isRequired,
  // Event Listeners
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

Node.defaultProps = {
  onNodeMove: null,
  onNodeDelete: null,
  onNodeClick: null,
  onNodeDblClick: null,
  onNodeConnectorDragStart: null,
  onPlaceholderConnectorDragStart: null,
};

export default Node;
