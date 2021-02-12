import React from 'react';
import PropTypes from 'prop-types';

import {
  Group,
  Text,
} from 'react-konva';

import defaultStyle from '../../../style/default.json';

function NodeDeleteButton({
  nodeId,
  nodeWidth,
  isFinal,
  isFullDisabled,
  isDraggingSelectionRect,
  selectedEdgeRef,
  setSelectedEdgeRef,
  clearEdgeSelection,
  clearNodeSelection,
  transformerRef,
  removeNode,
  onNodeDelete,
  setCursor,
  fontFamily,
  style,
}) {
  // Handle node remove click
  const handleRemoveClick = (e) => {
    e.cancelBubble = true;
    transformerRef.current.nodes([]);
    setCursor('move');
    if (selectedEdgeRef) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
      clearEdgeSelection();
    }
    clearNodeSelection();
    removeNode({
      nodeId,
      onNodeDelete,
    });
  };

  const handleMouseOver = (e) => {
    if (!isDraggingSelectionRect) {
      e.cancelBubble = true;
      setCursor('pointer');
      e.target.attrs.fill = style.overTextColor;
      e.target.draw();
    }
  };

  const handleMouseLeave = (e) => {
    if (!isDraggingSelectionRect) {
      e.cancelBubble = true;
      e.target.attrs.fill = style.textColor;
      e.target.draw();
    }
  };

  return (
    <Group>
      { !isFinal && !isFullDisabled && (
        <Text
          x={nodeWidth - style.paddingX}
          y={style.paddingY}
          fill={style.textColor}
          fontFamily={fontFamily}
          fontSize={style.fontSize}
          text={style.text}
          onClick={handleRemoveClick}
          onTap={handleRemoveClick}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </Group>
  );
}

NodeDeleteButton.propTypes = {
  nodeId: PropTypes.number.isRequired,
  nodeWidth: PropTypes.number.isRequired,
  isFinal: PropTypes.bool,
  isFullDisabled: PropTypes.bool,
  isDraggingSelectionRect: PropTypes.bool,
  selectedEdgeRef: PropTypes.shape({
    moveToBottom: PropTypes.func,
  }),
  setSelectedEdgeRef: PropTypes.func,
  clearNodeSelection: PropTypes.func,
  clearEdgeSelection: PropTypes.func,
  transformerRef: PropTypes.shapre({
    current: PropTypes.shape({
      nodes: PropTypes.func,
    }),
  }),
  removeNode: PropTypes.func,
  onNodeDelete: PropTypes.func,
  setCursor: PropTypes.func,
  fontFamily: PropTypes.string,
  style: PropTypes.exact({
    paddingX: PropTypes.number,
    paddingY: PropTypes.number,
    fontSize: PropTypes.number,
    text: PropTypes.string,
    textColor: PropTypes.string,
    overTextColor: PropTypes.string,
  }),
};

NodeDeleteButton.defaultProps = {
  isFinal: false,
  isFullDisabled: false,
  isDraggingSelectionRect: false,
  selectedEdgeRef: null,
  setSelectedEdgeRef: () => {},
  clearNodeSelection: () => {},
  clearEdgeSelection: () => {},
  transformerRef: null,
  removeNode: () => {},
  onNodeDelete: () => {},
  setCursor: () => {},
  fontFamily: defaultStyle.fontFamily,
  style: defaultStyle.node.delete,
};

export default NodeDeleteButton;
