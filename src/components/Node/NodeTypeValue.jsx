import React from 'react';
import PropTypes from 'prop-types';

import {
  Label,
  Tag,
  Text,
} from 'react-konva';

function NodeTypeValue({
  typeText,
  valueText,
  nodeWidth,
  fontFamily,
  style,
}) {
  // Handle node remove click
  return (
    <Label x={nodeWidth / 2} y={-style.fontSize / 2}>
      {typeText !== '' || valueText !== '' ? (
        <>
          <Tag
            fill={style.fillColor}
            stroke={style.strokeColor}
            strokeWidth={style.strokeSize}
            pointerDirection={style.pointerDirection}
            pointerWidth={style.pointerWidth}
            pointerHeight={style.pointerHeight}
            cornerRadius={style.radius}
          />
          <Text
            fill={style.textColor}
            fontFamily={fontFamily}
            fontSize={style.fontSize}
            text={typeText + (typeText !== '' && valueText !== '' ? ': ' : '') + valueText}
            padding={style.padding}
          />
        </>
      ) : null}
    </Label>
  );
}

NodeTypeValue.propTypes = {
  typeText: PropTypes.string.isRequired,
  valueText: PropTypes.string.isRequired,
  nodeWidth: PropTypes.number.isRequired,
  fontFamily: PropTypes.string.isRequired,
  style: PropTypes.exact({
    fontSize: PropTypes.number,
    fillColor: PropTypes.string,
    strokeSize: PropTypes.string,
    strokeColor: PropTypes.string,
    pointerDirection: PropTypes.string,
    pointerWidth: PropTypes.number,
    pointerHeight: PropTypes.number,
    radius: PropTypes.number,
    textColor: PropTypes.string,
    padding: PropTypes.number,
  }).isRequired,
};

NodeTypeValue.defaultProps = {};

export default NodeTypeValue;
