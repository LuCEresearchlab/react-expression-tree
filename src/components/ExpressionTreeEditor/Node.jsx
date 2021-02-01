import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Rect, Text, Group, Circle, Star, Label, Tag,
} from 'react-konva';
import {
  computePiecesPositions,
  edgeByChildNode,
  edgeByParentPiece,
} from '../utils';

function Node({
  id,
  pieces,
  x,
  y,
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
  pressingMeta,
  xPad,
  yPad,
  holeWidth,
  textHeight,
  connectorPlaceholder,
  fullDisabled,
  removeNode,
  clearNodeSelection,
  moveNodeTo,
  moveNodeToEnd,
  clearEdgeSelection,
  // Event Listeners
  onNodeMove,
  onNodeSelect,
  onNodeDelete,
  onNodeClick,
  onNodeDblClick,
  onNodeConnectorDragStart,
  onHoleConnectorDragStart,
  // Style
  style,
}) {
  // State hook to keep track when we are dragging a node
  // and not from a node/hole connector
  const [draggingNode, setDraggingNode] = useState(false);

  // Compute the positions of each node piece
  const piecesPos = computePiecesPositions(
    pieces,
    connectorPlaceholder,
    style.fontSize,
    style.fontFamily,
  );

  // Handle drag start event of a node, if a meta key is not being pressed,
  // set up the state for node drag move event, otherwise stop the node drag
  const handleDragStart = (e) => {
    if (!pressingMeta) {
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
      const id = e.target.id();
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
      const id = e.target.id();
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
    if (!pressingMeta) {
      e.cancelBubble = true;
      transformerRef.current.nodes([]);
      onNodeClick(e);
    }
  };

  // Handle drag start event from a node connector,
  // starting drag event from the node connector if a meta key is not being pressed,
  // otherwise stop the node connector drag
  const handleNodeConnectorDragStart = (e) => {
    if (!pressingMeta) {
      // prevent onDragStart of Group
      e.cancelBubble = true;
      transformerRef.current.nodes([]);
      if (selectedEdgeRef) {
        selectedEdgeRef.moveToBottom();
        setSelectedEdgeRef(null);
        clearEdgeSelection();
      }
      document.body.style.cursor = 'grabbing';
      const nodeId = e.target.id();
      // we don't want the connector to be moved
      e.target.stopDrag();
      // but we want to initiate the moving around of the connection
      onNodeConnectorDragStart(
        nodeId,
        e.target.parent.x() + e.target.x(),
        e.target.parent.y() + e.target.y(),
      );
    } else {
      e.target.stopDrag();
    }
  };

  // Handle drag start event from a hole connector,
  // starting drag event from the hole connector if a meta key is not being pressed,
  // otherwise stop the hole connector drag
  const handleHoleConnectorDragStart = (e, nodeId) => {
    if (!pressingMeta) {
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
      onHoleConnectorDragStart(
        nodeId,
        pieceId,
        e.target.parent.parent.x()
          + e.target.parent.x()
          + e.target.x()
          + holeWidth / 2,
        e.target.parent.parent.y()
          + e.target.parent.y()
          + e.target.y()
          + holeWidth * 0.75,
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

  return (
    // A Node is a Group consisting in a Rect, an id Text, an "X" node deleting Text,
    // a Circle/Star node connector, zero or more Rect hole connectors (+ Circle if hole if already occupied),
    // one or more text pieces, and Label containing the node's selected type and value
    <Group
      key={`Node-${id}`}
      id={id}
      x={x}
      y={y}
      draggable={!fullDisabled}
      onClick={!fullDisabled && handleNodeClick}
      onTap={!fullDisabled && handleNodeClick}
      onDblClick={!fullDisabled && onNodeDblClick}
      onDblTap={!fullDisabled && onNodeDblClick}
      onDragStart={!fullDisabled && ((e) => handleDragStart(e))}
      onTouchStart={!fullDisabled && ((e) => handleDragStart(e))}
      onDragMove={!fullDisabled && handleDragMove}
      onTouchMove={!fullDisabled && handleDragMove}
      onDragEnd={!fullDisabled && handleDragEnd}
      onTouchEnd={!fullDisabled && handleDragEnd}
      dragBoundFunc={(pos) => checkDragBound(pos)}
      onMouseOver={
        !fullDisabled
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
        x={0}
        y={0}
        width={nodeWidth}
        height={nodeHeight}
        fill={
          currentErrorLocation
          && currentErrorLocation.node
          && currentErrorLocation.nodeId === id
            ? style.node.errorColor
            : isSelected
              ? style.node.selectedColor
              : isFinal
                ? style.node.finalColor
                : style.node.color
        }
        stroke="black"
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={5}
        hitStrokeWidth={0}
        shadowEnabled={!!isSelected}
        shadowColor="black"
        shadowOffset={{ x: 3, y: 3 }}
        shadowBlur={3}
        shadowForStrokeEnabled={false}
      />
      {isSelectedRoot ? (
        <Star
          id={id}
          x={nodeWidth / 2}
          y={0}
          numPoints={5}
          innerRadius={style.fontSize / 5}
          outerRadius={style.fontSize / 2.5}
          fill={
            currentErrorLocation
            && currentErrorLocation.nodeConnector
            && currentErrorLocation.nodeId === id
              ? style.node.errorColor
              : isSelected
                ? style.node.selectedColor
                : edgeByChildNode(id, edges).length > 0
                  ? style.edge.connector.childColor
                  : style.node.connector.rootColor
          }
          stroke="black"
          strokeWidth={2}
          draggable={!fullDisabled}
          onDragStart={!fullDisabled && handleNodeConnectorDragStart}
          onTouchStart={!fullDisabled && handleNodeConnectorDragStart}
          onDragMove={() => {}}
          onDragEnd={() => {}}
          onMouseOver={
            !fullDisabled
            && ((e) => {
              e.cancelBubble = true;
              document.body.style.cursor = 'grab';
            })
          }
        />
      ) : (
        <Circle
          key={`NodeConnector-${id}`}
          id={id}
          x={nodeWidth / 2}
          y={0}
          radius={style.fontSize / 4}
          fill={
            currentErrorLocation
            && currentErrorLocation.nodeConnector
            && currentErrorLocation.nodeId === id
              ? style.node.errorColor
              : edgeByChildNode(id, edges).length > 0
                ? style.edge.connector.childColor
                : style.node.connector.nodeColor
          }
          stroke="black"
          strokeWidth={1}
          draggable={!fullDisabled}
          onDragStart={!fullDisabled && handleNodeConnectorDragStart}
          onTouchStart={!fullDisabled && handleNodeConnectorDragStart}
          onDragMove={() => {}}
          onDragEnd={() => {}}
          onMouseOver={
            !fullDisabled
            && ((e) => {
              e.cancelBubble = true;
              document.body.style.cursor = 'grab';
            })
          }
        />
      )}
      {pieces.map((p, i) => (p === connectorPlaceholder ? (
        <Group key={`HolePiece-${i}`}>
          <Rect
            id={i}
            x={xPad + piecesPos[i]}
            y={nodeHeight / 2 - yPad}
            width={holeWidth}
            height={textHeight}
            fill={
                currentErrorLocation
                && currentErrorLocation.pieceConnector
                && currentErrorLocation.nodeId === id
                && currentErrorLocation.pieceId === i
                  ? style.node.errorColor
                  : style.node.placeholderColor
              }
            stroke="black"
            strokeWidth={1}
            cornerRadius={3}
            draggable={!fullDisabled}
            onDragStart={
                !fullDisabled && ((e) => handleHoleConnectorDragStart(e, id))
              }
            onTouchStart={
                !fullDisabled && ((e) => handleHoleConnectorDragStart(e, id))
              }
            onDragMove={() => {}}
            onDragEnd={() => {}}
            onMouseOver={
                !fullDisabled
                && ((e) => {
                  e.cancelBubble = true;
                  document.body.style.cursor = 'grab';
                })
              }
          />
          <Circle
            id={i}
            x={xPad + piecesPos[i] + holeWidth / 2}
            y={yPad + textHeight / 2}
            draggable={!fullDisabled}
            onDragStart={
                !fullDisabled && ((e) => handleHoleConnectorDragStart(e, id))
              }
            onTouchStart={
                !fullDisabled && ((e) => handleHoleConnectorDragStart(e, id))
              }
            onDragMove={(e) => {}}
            onDragEnd={(e) => {}}
            radius={style.fontSize / 4}
            fill={style.edge.connector.parentColor}
            stroke="black"
            strokeWidth={1}
            onMouseOver={
                !fullDisabled
                && ((e) => {
                  e.cancelBubble = true;
                  document.body.style.cursor = 'grab';
                })
              }
            visible={edgeByParentPiece(id, i, edges).length > 0}
          />
        </Group>
      ) : (
        <Text
          key={`TextPiece-${i}`}
          x={xPad + piecesPos[i]}
          y={yPad}
          fill={style.node.textColor}
          fontFamily={style.fontFamily}
          fontSize={style.fontSize}
          text={p}
          listening={false}
        />
      )))}
      {!isFinal && !fullDisabled && (
        <Text
          x={nodeWidth - xPad}
          y={3}
          fill={style.node.textColor}
          fontFamily={style.fontFamily}
          fontSize={style.fontSize / 2}
          text="X"
          onClick={handleRemoveClick}
          onTap={handleRemoveClick}
          onMouseOver={
            (e) => {
              if (!draggingSelectionRect) {
                e.cancelBubble = true;
                document.body.style.cursor = 'pointer';
                e.target.attrs.fill = style.node.deleteButtonColor;
                e.target.draw();
              }
            }
          }
          onMouseLeave={(e) => {
            if (!draggingSelectionRect) {
              e.cancelBubble = true;
              e.target.attrs.fill = style.node.textColor;
              e.target.draw();
            }
          }}
        />
      )}
      <Label x={nodeWidth / 2} y={-style.fontSize / 4}>
        <Tag
          fill={style.node.tagColor}
          stroke="black"
          strokeWidth={type !== '' || value !== '' ? 1 : 0}
          pointerDirection="down"
          pointerWidth={type !== '' || value !== '' ? style.fontSize / 3 : 0}
          pointerHeight={type !== '' || value !== '' ? style.fontSize / 4 : 0}
          cornerRadius={3}
        />
        <Text
          fill={style.node.textColor}
          fontFamily={style.fontFamily}
          fontSize={style.fontSize / 2}
          text={type + (type !== '' && value !== '' ? ': ' : '') + value}
          padding={type !== '' || value !== '' ? 5 : 0}
        />
      </Label>
    </Group>
  );
}

Node.propTypes = {
  id: PropTypes.number,
  pieces: PropTypes.arrayOf(PropTypes.string),
  x: PropTypes.number,
  y: PropTypes.number,
  nodeWidth: PropTypes.number,
  nodeHeight: PropTypes.number,
  type: PropTypes.string,
  value: PropTypes.string,
  isFinal: PropTypes.bool,
  isSelected: PropTypes.bool,
  isSelectedRoot: PropTypes.bool,
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      pieces: PropTypes.arrayOf(PropTypes.string),
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
  pressingMeta: PropTypes.bool,
  xPad: PropTypes.number,
  yPad: PropTypes.number,
  holeWidth: PropTypes.number,
  textHeight: PropTypes.number,
  connectorPlaceholder: PropTypes.string,
  fullDisabled: PropTypes.bool,
  removeNode: PropTypes.func,
  clearNodeSelection: PropTypes.func,
  moveNodeTo: PropTypes.func,
  moveNodeToEnd: PropTypes.func,
  clearEdgeSelection: PropTypes.func,
  // Event Listeners
  onNodeMove: PropTypes.func,
  onNodeSelect: PropTypes.func,
  onNodeDelete: PropTypes.func,
  onNodeClick: PropTypes.func,
  onNodeDblClick: PropTypes.func,
  onNodeConnectorDragStart: PropTypes.func,
  onHoleConnectorDragStart: PropTypes.func,
  // Style
  style: PropTypes.exact({
    fontSize: PropTypes.number,
    fontFamily: PropTypes.string,
    node: PropTypes.exact({
      color: PropTypes.string,
      errorColor: PropTypes.string,
      selectedColor: PropTypes.string,
      finalColor: PropTypes.string,
      placeholderColor: PropTypes.string,
      tagColor: PropTypes.string,
      textColor: PropTypes.string,
      deleteButtonColor: PropTypes.string,
      connector: PropTypes.exact({
        rootColor: PropTypes.string,
        nodeColor: PropTypes.string,
      }),
    }),
    edge: PropTypes.exact({
      connector: PropTypes.exact({
        childColor: PropTypes.string,
        parentColor: PropTypes.string,
      }),
    }),
  }).isRequired,
};

Node.defaultProps = {
  onNodeMove: null,
  onNodeSelect: null,
  onNodeDelete: null,
  onNodeClick: null,
  onNodeDblClick: null,
  onNodeConnectorDragStart: null,
  onHoleConnectorDragStart: null,
};

export default Node;
