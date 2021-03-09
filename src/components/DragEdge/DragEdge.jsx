import React from 'react';
import PropTypes from 'prop-types';
import { Line, Circle } from 'react-konva';

import defaultStyle from '../../style/default.json';

/**
 *
 * The DragEdge component represent the Edge that is being dragged
 *
 */
function DragEdge({
  childX,
  childY,
  parentX,
  parentY,
  style,
}) {
  return (
    // DragEdge is composed of a Line and two Circles
    <>
      <Line
        points={[childX, childY, parentX, parentY]}
        stroke={style.color}
        strokeWidth={style.strokeSize}
      />
      <Circle
        x={childX}
        y={childY}
        radius={style.connector.child.radiusSize}
        fill={style.connector.child.color}
        stroke={style.connector.child.strokeColor}
        strokeWidth={style.connector.child.strokeSize}
      />
      <Circle
        x={parentX}
        y={parentY}
        radius={style.connector.parent.radiusSize}
        fill={style.connector.parent.color}
        stroke={style.connector.parent.strokeColor}
        strokeWidth={style.connector.parent.strokeSize}
      />
    </>
  );
}

DragEdge.propTypes = {
  childX: PropTypes.number.isRequired,
  childY: PropTypes.number.isRequired,
  parentX: PropTypes.number.isRequired,
  parentY: PropTypes.number.isRequired,
  style: PropTypes.exact({
    strokeSize: PropTypes.number,
    color: PropTypes.string,
    connector: PropTypes.exact({
      child: PropTypes.exact({
        radiusSize: PropTypes.number,
        color: PropTypes.string,
        strokeSize: PropTypes.number,
        strokeColor: PropTypes.string,
      }),
      parent: PropTypes.exact({
        radiusSize: PropTypes.number,
        color: PropTypes.string,
        strokeSize: PropTypes.number,
        strokeColor: PropTypes.string,
      }),
    }),
  }),
};

DragEdge.defaultProps = {
  style: defaultStyle.dragEdge,
};

export default DragEdge;
