import React, { useState, useEffect, useRef } from "react";
import { Rect, Text, Group, Circle, Transformer } from "react-konva";
import {
  xPad,
  yPad,
  fontFamily,
  defaultFontSize,
  textHeight,
  holeWidth,
  computePiecesPositions,
  computeNodeWidth,
} from "../layout.js";
import { log } from "../debug.js";

function Node({
  id,
  pieces,
  x,
  y,
  selected,
  onNodeMove,
  onNodeConnectorDragStart,
  onPieceConnectorDragStart,
  onNodeClick,
}) {
  const nodeMinWidth = computeNodeWidth(pieces, defaultFontSize);
  const xes = computePiecesPositions(pieces);

  const nodeRef = useRef();
  const transformerRef = useRef();

  // keep track
  // to prevent onMoveNode() notifications
  // when we don't drag the node itself but drag from a connector
  const [draggingNode, setDraggingNode] = useState(false);

  const [fontSize, setFontSize] = useState(defaultFontSize);

  useEffect(() => {
    if (selected) {
      transformerRef.current.nodes([nodeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selected]);

  const handleDragStart = e => {
    const id = e.target.id();
    setDraggingNode(true);
    log("Node.handleDragStart", id, e);
  };
  const handleDragMove = e => {
    if (draggingNode) {
      const id = e.target.id();
      log("Node.handleDragMove", id, e);
      const x = e.target.x();
      const y = e.target.y();
      onNodeMove(id, x, y);
      //onNodeMove(id, x, y, e); // hack to allow use in Toolbar
    }
  };
  const handleDragEnd = e => {
    if (draggingNode) {
      const id = e.target.id();
      log("Node.handleDragEnd", id, e);
      const x = e.target.x();
      const y = e.target.y();
      onNodeMove(id, x, y);
      //onNodeMove(id, x, y, e); // hack to allow use in Toolbar
    }
    setDraggingNode(false);
  };

  const handleNodeConnectorDragStart = e => {
    e.cancelBubble = true; // prevent onDragStart of Group
    const nodeId = e.target.id();
    const pos = e.target.absolutePosition();
    log("Node.handleNodeConnectorDragStart", nodeId, pos.x, pos.y, e);
    // we don't want the connector to be moved
    e.target.stopDrag();
    // but we want to initiate the moving around of the connection
    onNodeConnectorDragStart(nodeId, pos.x, pos.y);
  };

  const handlePieceConnectorDragStart = (e, nodeId) => {
    e.cancelBubble = true; // prevent onDragStart of Group
    const pieceId = e.target.id();
    const pos = e.target.absolutePosition();
    log("Node.handlePieceConnectorDragStart", nodeId, pieceId, pos.x, pos.y, e);
    // we don't want the connector to be moved
    e.target.stopDrag();
    // but we want to initiate the moving around of the connection
    onPieceConnectorDragStart(
      nodeId,
      pieceId,
      pos.x + holeWidth / 2,
      pos.y + textHeight
    );
  };

  const handleNodeClick = e => {
    e.cancelBubble = true;
    onNodeClick(e);
  };

  const checkBoxBound = (oldBox, newBox) => {
    if (
      newBox.width < 2 * xPad + nodeMinWidth ||
      newBox.height < 2 * yPad + textHeight
    ) {
      return oldBox;
    }
    return newBox;
  };

  const checkDragBound = pos => {
    var newX = pos.x;
    var newY = pos.y;
    if (pos.x < 0) {
      newX = 0;
    } else if (pos.x > window.innerWidth) {
      newX = window.innerWidth;
    }
    if (pos.y < 0) {
      newY = 0;
    } else if (pos.y > window.innerHeight) {
      newY = window.innerHeight;
    }
    return {
      x: newX,
      y: newY,
    };
  };

  return (
    <Group
      kind="Node"
      key={"Node-" + id}
      id={id}
      x={x}
      y={y}
      draggable
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onClick={handleNodeClick}
      dragBoundFunc={pos => checkDragBound(pos)}
    >
      <Rect
        kind="NodeRect"
        key={"NodeRect-" + id}
        x={0}
        y={0}
        width={2 * xPad + nodeMinWidth}
        height={2 * yPad + textHeight}
        fill="#208020"
        cornerRadius={5}
        shadowBlur={selected ? 4 : 0}
        ref={nodeRef}
        onTransform={() => {
          const node = nodeRef.current;
          setFontSize((node.scaleX() + node.scaleY() / 2) * defaultFontSize);
        }}
      />
      <Text
        x={0}
        y={0}
        fill="white"
        fontFamily={"Arial"}
        fontSize={fontSize * 0.75}
        text={"" + id}
      />
      <Circle
        kind="NodeConnector"
        key={"NodeConnector-" + id}
        id={id}
        x={xPad + nodeMinWidth / 2}
        y={0}
        radius={6}
        fill="black"
        draggable
        onDragStart={handleNodeConnectorDragStart}
        onDragMove={e => {}}
        onDragEnd={e => {}}
      />
      {pieces.map((p, i) =>
        p == null ? (
          <Rect
            kind="HolePiece"
            key={"HolePiece-" + i}
            id={i}
            x={xPad + xes[i]}
            y={yPad}
            width={holeWidth}
            height={textHeight}
            fill="#104010"
            cornerRadius={4}
            draggable
            onDragStart={e => handlePieceConnectorDragStart(e, id)}
            onDragMove={e => {}}
            onDragEnd={e => {}}
          />
        ) : (
          <Text
            kind="TextPiece"
            key={"TextPiece-" + i}
            x={xPad + xes[i]}
            y={yPad}
            fill="white"
            fontFamily={fontFamily}
            fontSize={fontSize}
            text={p}
          />
        )
      )}
      {selected && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={false}
          centeredScaling={true}
          anchorSize={7}
          borderEnabled={false}
          anchorCornerRadius={3}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
          boundBoxFunc={(oldBox, newBox) => checkBoxBound(oldBox, newBox)}
        />
      )}
    </Group>
  );
}

export default Node;
