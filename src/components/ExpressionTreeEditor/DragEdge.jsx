import React from 'react';
import PropTypes from 'prop-types';
import { Line, Circle } from 'react-konva';

function DragEdge({
  childX,
  childY,
  parentX,
  parentY,
  fontSize,
  dragEdgeColor,
  dragEdgeChildConnectorColor,
  dragEdgeParentConnectorColor,
}) {
  return (
    // DragEdge is composed of a Line and two Circle ends components
    <>
      <Line
        points={[childX, childY, parentX, parentY]}
        stroke={dragEdgeColor}
        strokeWidth={fontSize / 4}
        lineCap="round"
        lineJoin="round"
      />
      <Circle
        x={childX}
        y={childY}
        radius={fontSize / 4}
        fill={dragEdgeChildConnectorColor}
        stroke="black"
        strokeWidth={1}
      />
      <Circle
        x={parentX}
        y={parentY}
        radius={fontSize / 4}
        fill={dragEdgeParentConnectorColor}
        stroke="black"
        strokeWidth={1}
      />
    </>
  );
}

DragEdge.propTypes = {
  childX: PropTypes.number,
  childY: PropTypes.number,
  parentX: PropTypes.number,
  parentY: PropTypes.number,
  fontSize: PropTypes.number,
  dragEdgeColor: PropTypes.string,
  dragEdgeChildConnectorColor: PropTypes.string,
  dragEdgeParentConnectorColor: PropTypes.string,
};

export default DragEdge;
