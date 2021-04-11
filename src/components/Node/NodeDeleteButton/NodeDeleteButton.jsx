import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import {
  Circle,
  Group,
  Text,
} from 'react-konva';

function NodeDeleteButton({
  nodeId,
  nodeWidth,
  // nodeHeight,
  isSelected,
  isFinal,
  isFullDisabled,
  isDraggingSelectionRect,
  removeNode,
  strokeWidth,
  radius,
  strokeColor,
  fillColor,
  textColor,
  overStrokeColor,
  overFillColor,
  overTextColor,
}) {
  const textRef = useRef();

  const handleMouseOver = (e) => {
    if (!isDraggingSelectionRect) {
      e.cancelBubble = true;
      e.target.attrs.fill = overFillColor;
      e.target.attrs.stroke = overStrokeColor;
      e.target.draw();
      textRef.current.attrs.fill = overTextColor;
      textRef.current.draw();
    }
  };

  const handleMouseLeave = (e) => {
    if (!isDraggingSelectionRect) {
      e.cancelBubble = true;
      e.target.attrs.fill = fillColor;
      e.target.attrs.stroke = strokeColor;
      e.target.draw();
      textRef.current.attrs.fill = textColor;
      textRef.current.draw();
    }
  };

  return (
    <Group>
      { !isFinal && !isFullDisabled && isSelected && (
        <>
          <Circle
            x={nodeWidth}
            // y={nodeHeight}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            radius={radius}
            onClick={() => removeNode(nodeId)}
            onTap={() => removeNode(nodeId)}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
          />
          <Text
            ref={textRef}
            x={nodeWidth - 3.5}
            y={-7}
            fill={textColor}
            fontSize={14}
            text="x"
            listening={false}
            onDragMove={() => {}}
            onDragEnd={() => {}}
          />
        </>
      )}
    </Group>
  );
}

NodeDeleteButton.propTypes = {
  nodeId: PropTypes.number.isRequired,
  nodeWidth: PropTypes.number.isRequired,
  nodeHeight: PropTypes.number.isRequired,
  isSelected: PropTypes.bool,
  isFinal: PropTypes.bool,
  isFullDisabled: PropTypes.bool,
  isDraggingSelectionRect: PropTypes.bool,
  removeNode: PropTypes.func,
  strokeWidth: PropTypes.number,
  radius: PropTypes.number,
  strokeColor: PropTypes.string,
  fillColor: PropTypes.string,
  textColor: PropTypes.string,
  overStrokeColor: PropTypes.string,
  overFillColor: PropTypes.string,
  overTextColor: PropTypes.string,
};

NodeDeleteButton.defaultProps = {
  isSelected: false,
  isFinal: false,
  isFullDisabled: false,
  isDraggingSelectionRect: false,
  removeNode: () => {},
  strokeWidth: 1,
  radius: 6,
  strokeColor: '#000000',
  fillColor: '#FF605C',
  textColor: '#FF605C',
  overStrokeColor: '#000000',
  overFillColor: '#FF605C',
  overTextColor: '#000000',
};

export default NodeDeleteButton;
