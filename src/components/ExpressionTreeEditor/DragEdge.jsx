import React from 'react';
import PropTypes from 'prop-types';
import { Line, Circle } from 'react-konva';

function DragEdge({
  childX,
  childY,
  parentX,
  parentY,
  // Style
  style,
}) {
  return (
    // DragEdge is composed of a Line and two Circle ends components
    <>
      <Line
        points={[childX, childY, parentX, parentY]}
        stroke={style.edge.dragColor}
        strokeWidth={style.fontSize / 4}
        lineCap="round"
        lineJoin="round"
      />
      <Circle
        x={childX}
        y={childY}
        radius={style.fontSize / 4}
        fill={style.edge.connector.childColor}
        stroke="black"
        strokeWidth={1}
      />
      <Circle
        x={parentX}
        y={parentY}
        radius={style.fontSize / 4}
        fill={style.edge.connector.parentColor}
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
  // Style
  style: PropTypes.exact({
    fontSize: PropTypes.number,
    edge: PropTypes.exact({
      dragColor: PropTypes.string,
      connector: PropTypes.exact({
        childColor: PropTypes.string,
        parentColor: PropTypes.string,
      }),
    }),
  }).isRequired,
};

DragEdge.defaultProps = {};

export default DragEdge;
