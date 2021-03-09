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
  removeNode,
  fontFamily,
  style,
}) {
  const handleMouseOver = (e) => {
    if (!isDraggingSelectionRect) {
      e.cancelBubble = true;
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
          onClick={() => removeNode(nodeId)}
          onTap={() => removeNode(nodeId)}
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
  removeNode: PropTypes.func,
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
  removeNode: () => {},
  fontFamily: defaultStyle.fontFamily,
  style: defaultStyle.node.delete,
};

export default NodeDeleteButton;
