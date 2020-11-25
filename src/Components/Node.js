import React, { useState } from "react";
import { Rect, Text, Group, Circle, Star, Label, Tag } from "react-konva";
import {
  xPad,
  yPad,
  fontFamily,
  fontSize,
  textHeight,
  holeWidth,
  computePiecesPositions,
  edgeByParentPiece,
  nodeById,
} from "../utils.js";

function Node({
  connectorPlaceholder,
  id,
  pieces,
  x,
  y,
  isSelected,
  moveNodeTo,
  moveNodeToEnd,
  selectNode,
  removeNode,
  clearEdgeSelection,
  onNodeConnectorDragStart,
  onPieceConnectorDragStart,
  onNodeClick,
  onNodeDblClick,
  stageWidth,
  stageHeight,
  isSelectedRoot,
  nodeWidth,
  stageRef,
  transformerRef,
  edges,
  nodes,
  type,
  value,
  selectedEdgeRef,
  setSelectedEdgeRef,
  editValueChange,
  typeValueChange,
  nodeValueChange,
  clearNodeSelection,
  isFinal,
  pressingMeta,
  draggingSelectionRect,
}) {
  // keep track
  // to prevent onMoveNode() notifications
  // when we don't drag the node itself but drag from a connector
  const [draggingNode, setDraggingNode] = useState(false);

  const nodeHeight = 2 * yPad + textHeight;
  const piecesPos = computePiecesPositions(pieces, connectorPlaceholder);

  const handleDragStart = e => {
    if (!pressingMeta) {
      transformerRef.current.nodes([]);
      e.currentTarget.moveToTop();
      setDraggingNode(true);
      const selectingNode = nodeById(id, nodes);
      if (!isSelected) {
        selectNode({ selectedNode: selectingNode });
        if (!selectingNode.isFinal) {
          document.getElementById(
            "editField"
          ).value = selectingNode.pieces.join("");
          editValueChange({ editValue: selectingNode.pieces });
        }
        typeValueChange({ typeValue: selectingNode.type });
        document.getElementById("valueField").value = selectingNode.value;
        nodeValueChange({ nodeValue: selectingNode.value });
        if (selectedEdgeRef) {
          selectedEdgeRef.moveToBottom();
          setSelectedEdgeRef(null);
          clearEdgeSelection();
        }
      }
    } else {
      e.target.stopDrag();
    }
  };

  const handleDragMove = e => {
    e.cancelBubble = true;
    if (draggingNode) {
      const id = e.target.id();
      const x = e.target.x();
      const y = e.target.y();
      moveNodeTo({ nodeId: id, x: x, y: y });
    }
  };

  const handleDragEnd = e => {
    e.cancelBubble = true;
    document.body.style.cursor = "pointer";
    if (draggingNode) {
      const id = e.target.id();
      const x = e.target.x();
      const y = e.target.y();
      moveNodeToEnd({ nodeId: id, x: x, y: y });
    }
    setDraggingNode(false);
  };

  const handleNodeClick = e => {
    if (!pressingMeta) {
      e.cancelBubble = true;
      transformerRef.current.nodes([]);
      onNodeClick(e);
    }
  };

  const handleNodeConnectorDragStart = e => {
    if (!pressingMeta) {
      e.cancelBubble = true; // prevent onDragStart of Group
      transformerRef.current.nodes([]);
      if (selectedEdgeRef) {
        selectedEdgeRef.moveToBottom();
        setSelectedEdgeRef(null);
        clearEdgeSelection();
      }
      document.body.style.cursor = "grabbing";
      const nodeId = e.target.id();
      // we don't want the connector to be moved
      e.target.stopDrag();
      // but we want to initiate the moving around of the connection
      onNodeConnectorDragStart(
        nodeId,
        e.target.parent.x() + e.target.x(),
        e.target.parent.y() + e.target.y()
      );
    } else {
      e.target.stopDrag();
    }
  };

  const handlePieceConnectorDragStart = (e, nodeId) => {
    if (!pressingMeta) {
      e.cancelBubble = true; // prevent onDragStart of Group
      transformerRef.current.nodes([]);
      if (selectedEdgeRef) {
        selectedEdgeRef.moveToBottom();
        setSelectedEdgeRef(null);
        clearEdgeSelection();
      }
      document.body.style.cursor = "grabbing";
      const pieceId = e.target.id();
      // const pos = e.target.absolutePosition();
      // we don't want the connector to be moved
      e.target.stopDrag();
      // but we want to initiate the moving around of the connection
      onPieceConnectorDragStart(
        nodeId,
        pieceId,
        e.target.parent.parent.x() +
          e.target.parent.x() +
          e.target.x() +
          holeWidth / 2,
        e.target.parent.parent.y() +
          e.target.parent.y() +
          e.target.y() +
          holeWidth * 0.75
      );
    } else {
      e.target.stopDrag();
    }
  };

  const checkDragBound = pos => {
    const stageScale = stageRef.current.scale();
    var newX = pos.x;
    var newY = pos.y;
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

  const handleRemoveClick = e => {
    transformerRef.current.nodes([]);
    document.body.style.cursor = "move";
    if (selectedEdgeRef) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
      clearEdgeSelection();
    }
    clearNodeSelection();
    removeNode({ nodeId: e.target.parent.attrs.id });
  };

  return (
    <Group
      key={"Node-" + id}
      id={id}
      x={x}
      y={y}
      draggable
      onClick={handleNodeClick}
      onDblClick={onNodeDblClick}
      onDragStart={e => handleDragStart(e)}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      dragBoundFunc={pos => checkDragBound(pos)}
      onMouseOver={e => {
        e.cancelBubble = true;
        document.body.style.cursor = "pointer";
      }}
    >
      <Rect
        name="Node"
        id={id}
        key={"NodeRect-" + id}
        x={0}
        y={0}
        width={nodeWidth}
        height={nodeHeight}
        fill={isFinal ? "#208080" : isSelected ? "#3f50b5" : "#208020"}
        stroke="black"
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={5}
        shadowEnabled={isSelected ? true : false}
        shadowColor="black"
        shadowOffset={{ x: 3, y: 3 }}
        shadowBlur={3}
      />
      <Text
        x={3}
        y={3}
        fill="white"
        fontFamily={fontFamily}
        fontSize={fontSize * 0.4}
        text={id}
      />
      {isSelectedRoot ? (
        <Star
          id={id}
          x={nodeWidth / 2}
          y={0}
          numPoints={5}
          innerRadius={fontSize / 5}
          outerRadius={fontSize / 2.5}
          fill="#3f50b5"
          stroke="black"
          strokeWidth={2}
          draggable
          onDragStart={handleNodeConnectorDragStart}
          onDragMove={() => {}}
          onDragEnd={() => {}}
          onMouseOver={e => {
            e.cancelBubble = true;
            document.body.style.cursor = "grab";
          }}
        />
      ) : (
        <Circle
          key={"NodeConnector-" + id}
          id={id}
          x={nodeWidth / 2}
          y={0}
          radius={fontSize / 4}
          fill="black"
          draggable
          onDragStart={handleNodeConnectorDragStart}
          onDragMove={e => {}}
          onDragEnd={e => {}}
          onMouseOver={e => {
            e.cancelBubble = true;
            document.body.style.cursor = "grab";
          }}
        />
      )}
      {pieces.map((p, i) =>
        p === connectorPlaceholder ? (
          <Group key={"HolePiece-" + i}>
            <Rect
              id={i}
              x={xPad + piecesPos[i]}
              y={nodeHeight / 2 - yPad}
              width={holeWidth}
              height={textHeight}
              fill="#104010"
              stroke="black"
              strokeWidth={1}
              cornerRadius={3}
              draggable
              onDragStart={e => handlePieceConnectorDragStart(e, id)}
              onDragMove={e => {}}
              onDragEnd={e => {}}
              onMouseOver={e => {
                e.cancelBubble = true;
                document.body.style.cursor = "grab";
              }}
            />
            <Circle
              id={i}
              x={xPad + piecesPos[i] + holeWidth / 2}
              y={yPad + textHeight / 2}
              draggable
              onDragStart={e => handlePieceConnectorDragStart(e, id)}
              onDragMove={e => {}}
              onDragEnd={e => {}}
              radius={fontSize / 4}
              fill="black"
              onMouseOver={e => {
                e.cancelBubble = true;
                document.body.style.cursor = "grab";
              }}
              visible={edgeByParentPiece(id, i, edges).length > 0}
            />
          </Group>
        ) : (
          <Text
            key={"TextPiece-" + i}
            x={xPad + piecesPos[i]}
            y={yPad}
            fill="white"
            fontFamily={fontFamily}
            fontSize={fontSize}
            text={p}
          />
        )
      )}
      {!isFinal && (
        <Text
          x={nodeWidth - xPad}
          y={3}
          fill="white"
          fontFamily={fontFamily}
          fontSize={fontSize / 2}
          text="X"
          onClick={e => handleRemoveClick(e)}
          onMouseOver={e => {
            if (!draggingSelectionRect) {
              e.cancelBubble = true;
              document.body.style.cursor = "pointer";
              e.target.fill("red");
              e.target.draw();
            }
          }}
          onMouseLeave={e => {
            if (!draggingSelectionRect) {
              e.cancelBubble = true;
              e.target.attrs.fill = "white";
              e.target.draw();
            }
          }}
        />
      )}
      <Label x={nodeWidth / 2} y={-fontSize / 4}>
        <Tag
          fill="#3f50b5"
          stroke="black"
          strokeWidth={type !== "" || value !== "" ? 1 : 0}
          pointerDirection="down"
          pointerWidth={type !== "" || value !== "" ? fontSize / 3 : 0}
          pointerHeight={type !== "" || value !== "" ? fontSize / 4 : 0}
          cornerRadius={3}
        />
        <Text
          fill="white"
          fontFamily={fontFamily}
          fontSize={fontSize / 2}
          text={type + (type !== "" && value !== "" ? ": " : "") + value}
          padding={type !== "" || value !== "" ? 5 : 0}
        />
      </Label>
    </Group>
  );
}

export default Node;
