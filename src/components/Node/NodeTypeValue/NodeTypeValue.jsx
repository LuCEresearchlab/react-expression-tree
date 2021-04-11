import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  Label,
  Tag,
  Text,
} from 'react-konva';

function NodeTypeValue({
  nodeWidth,
  typeText,
  valueText,
  fontFamily,
  fontSize,
  strokeWidth,
  radius,
  padding,
  textColor,
  fillColor,
  strokeColor,
  pointerDirection,
  pointerWidth,
  pointerHeight,
}) {
  const x = useMemo(() => (nodeWidth / 2), [nodeWidth]);
  const y = useMemo(() => (-fontSize / 2), [fontSize]);
  const text = useMemo(() => (
    typeText + (typeText !== '' && valueText !== '' ? ': ' : '') + valueText
  ), [typeText, valueText]);

  // Handle node remove click
  return (
    <Label
      x={x}
      y={y}
    >
      {typeText !== '' || valueText !== '' ? (
        <>
          <Tag
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            pointerDirection={pointerDirection}
            pointerWidth={pointerWidth}
            pointerHeight={pointerHeight}
            cornerRadius={radius}
          />
          <Text
            fill={textColor}
            fontFamily={fontFamily}
            fontSize={fontSize}
            text={text}
            padding={padding}
          />
        </>
      ) : null}
    </Label>
  );
}

NodeTypeValue.propTypes = {
  nodeWidth: PropTypes.number.isRequired,
  typeText: PropTypes.string,
  valueText: PropTypes.string,
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  strokeWidth: PropTypes.number,
  radius: PropTypes.number,
  padding: PropTypes.number,
  textColor: PropTypes.string,
  fillColor: PropTypes.string,
  strokeColor: PropTypes.string,
  pointerDirection: PropTypes.string,
  pointerWidth: PropTypes.number,
  pointerHeight: PropTypes.number,
};

NodeTypeValue.defaultProps = {
  typeText: '',
  valueText: '',
  fontFamily: 'Roboto Mono, Courier',
  fontSize: 12,
  fillColor: '#3f51b5',
  strokeWidth: 1,
  strokeColor: '#000000',
  pointerDirection: 'down',
  pointerWidth: 3,
  pointerHeight: 4,
  radius: 3,
  textColor: '#ffffff',
  padding: 5,
};

export default NodeTypeValue;
