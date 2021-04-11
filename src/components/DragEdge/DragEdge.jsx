import React from 'react';
import PropTypes from 'prop-types';
import { Line, Circle } from 'react-konva';

/**
 * The DragEdge component represent the Edge that is being dragged
 */
function DragEdge({
  childX,
  childY,
  parentX,
  parentY,
  lineStrokeWidth,
  lineStrokeColor,
  childConnectorRadiusSize,
  childConnectorFillColor,
  childConnectorStrokeWidth,
  childConnectorStrokeColor,
  parentConnectorRadiusSize,
  parentConnectorFillColor,
  parentConnectorStrokeWidth,
  parentConnectorStrokeColor,

}) {
  return (
    // DragEdge is composed of a Line and two Circles
    <>
      <Line
        points={[childX, childY, parentX, parentY]}
        stroke={lineStrokeColor}
        strokeWidth={lineStrokeWidth}
      />
      <Circle
        x={childX}
        y={childY}
        radius={childConnectorRadiusSize}
        fill={childConnectorFillColor}
        stroke={childConnectorStrokeColor}
        strokeWidth={childConnectorStrokeWidth}
      />
      <Circle
        x={parentX}
        y={parentY}
        radius={parentConnectorRadiusSize}
        fill={parentConnectorFillColor}
        stroke={parentConnectorStrokeColor}
        strokeWidth={parentConnectorStrokeWidth}
      />
    </>
  );
}

DragEdge.propTypes = {
  /**
   * X coordinate of the child connector
   */
  childX: PropTypes.number.isRequired,
  /**
   * Y coordinate of the child connector
   */
  childY: PropTypes.number.isRequired,
  /**
   * X coordinate of the parent connector
   */
  parentX: PropTypes.number.isRequired,
  /**
   * Y coordinate of the parent connector
   */
  parentY: PropTypes.number.isRequired,
  lineStrokeWidth: PropTypes.number,
  lineStrokeColor: PropTypes.string,
  childConnectorRadiusSize: PropTypes.number,
  childConnectorFillColor: PropTypes.string,
  childConnectorStrokeWidth: PropTypes.number,
  childConnectorStrokeColor: PropTypes.string,
  parentConnectorRadiusSize: PropTypes.number,
  parentConnectorFillColor: PropTypes.string,
  parentConnectorStrokeWidth: PropTypes.number,
  parentConnectorStrokeColor: PropTypes.string,
};

DragEdge.defaultProps = {
  lineStrokeWidth: 6,
  lineStrokeColor: '#000000',
  childConnectorRadiusSize: 6,
  childConnectorFillColor: '#ff2f2f',
  childConnectorStrokeWidth: 1,
  childConnectorStrokeColor: '#000000',
  parentConnectorRadiusSize: 6,
  parentConnectorFillColor: '#ff2f2f',
  parentConnectorStrokeWidth: 1,
  parentConnectorStrokeColor: '#000000',
};

export default DragEdge;
