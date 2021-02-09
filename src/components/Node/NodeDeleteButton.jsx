import React from 'react';
import PropTypes from 'prop-types';

import {
  Group,
  Text,
} from 'react-konva';

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
  fontFamily,
  paddingX,
  style,
}) {
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
      nodeId,
      onNodeDelete,
    });
  };

  return (
    <Group>
      { !isFinal && !isFullDisabled && (
        <Text
          x={nodeWidth - paddingX}
          y={3}
          fill={style.textColor}
          fontFamily={fontFamily}
          fontSize={style.fontSize}
          text={style.text}
          onClick={handleRemoveClick}
          onTap={handleRemoveClick}
          onMouseOver={
            (e) => {
              if (!isDraggingSelectionRect) {
                e.cancelBubble = true;
                document.body.style.cursor = 'pointer';
                e.target.attrs.fill = style.overTextColor;
                e.target.draw();
              }
            }
          }
          onMouseLeave={(e) => {
            if (!isDraggingSelectionRect) {
              e.cancelBubble = true;
              e.target.attrs.fill = style.textColor;
              e.target.draw();
            }
          }}
        />
      )}
    </Group>
  );
}

NodeDeleteButton.propTypes = {
  nodeId: PropTypes.number.isRequired,
  nodeWidth: PropTypes.number.isRequired,
  isFinal: PropTypes.bool.isRequired,
  isFullDisabled: PropTypes.bool.isRequired,
  isDraggingSelectionRect: PropTypes.bool.isRequired,
  selectedEdgeRef: PropTypes.shape({
    moveToBottom: PropTypes.func,
  }).isRequired,
  setSelectedEdgeRef: PropTypes.func.isRequired,
  clearNodeSelection: PropTypes.func.isRequired,
  clearEdgeSelection: PropTypes.func.isRequired,
  transformerRef: PropTypes.shapre({
    current: PropTypes.shape({
      nodes: PropTypes.func,
    }),
  }).isRequired,
  removeNode: PropTypes.func.isRequired,
  onNodeDelete: PropTypes.func.isRequired,
  fontSize: PropTypes.number.isRequired,
  fontFamily: PropTypes.string.isRequired,
  paddingX: PropTypes.number.isRequired,
  style: PropTypes.exact({
    fontSize: PropTypes.number,
    text: PropTypes.string,
    textColor: PropTypes.string,
    overTextColor: PropTypes.string,
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

NodeDeleteButton.defaultProps = {};

export default NodeDeleteButton;
