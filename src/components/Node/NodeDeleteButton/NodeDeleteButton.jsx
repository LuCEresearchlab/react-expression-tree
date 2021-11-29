import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import {
  Circle,
  Group,
  Line,
} from 'react-konva';

function NodeDeleteButton({
  nodeId,
  nodeWidth,
  // nodeHeight,
  isSelected,
  editableLabel,
  editableType,
  editableValue,
  editableDelete,
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
  const line1Ref = useRef();
  const line2Ref = useRef();

  const handleMouseOver = (e) => {
    if (!isDraggingSelectionRect) {
      e.cancelBubble = true;
      e.target.attrs.fill = overFillColor;
      e.target.attrs.stroke = overStrokeColor;
      e.target.draw();
      line1Ref.current.attrs.stroke = overTextColor;
      line1Ref.current.draw();
      line2Ref.current.attrs.stroke = overTextColor;
      line2Ref.current.draw();
    }
  };

  const handleMouseLeave = (e) => {
    if (!isDraggingSelectionRect) {
      e.cancelBubble = true;
      e.target.attrs.fill = fillColor;
      e.target.attrs.stroke = strokeColor;
      e.target.draw();
      line1Ref.current.attrs.stroke = textColor;
      line1Ref.current.draw();
      line2Ref.current.attrs.stroke = textColor;
      line2Ref.current.draw();
    }
  };
  const cross = (radius - 2 * strokeWidth) / Math.sqrt(2);
  return (
    <Group>
      { !editableDelete && !isFullDisabled && isSelected && (
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
          <Line
            ref={line1Ref}
            stroke={textColor}
            strokeWidth={2}
            points={[nodeWidth - cross, -cross, nodeWidth + cross, cross]}
            listening={false}
            onDragMove={() => {}}
            onDragEnd={() => {}}
          />
          <Line
            ref={line2Ref}
            stroke={textColor}
            strokeWidth={2}
            points={[nodeWidth - cross, cross, nodeWidth + cross, -cross]}
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
  editableLabel: PropTypes.bool,
  editableType: PropTypes.bool,
  editableValue: PropTypes.bool,
  editableDelete: PropTypes.bool,
  isSelected: PropTypes.bool,
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
  editableLabel: false,
  editableType: false,
  editableValue: false,
  editableDelete: false,
  isSelected: false,
  isFullDisabled: false,
  isDraggingSelectionRect: false,
  removeNode: () => {},
  strokeWidth: 2,
  radius: 10,
  strokeColor: '#ffffff',
  fillColor: '#FF605C',
  textColor: '#ffffff',
  overStrokeColor: '#ffffff',
  overFillColor: '#ff0000',
  overTextColor: '#ffffff',
};

export default NodeDeleteButton;
