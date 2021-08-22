import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  Label,
  Tag,
  Text,
} from 'react-konva';
import Konva from 'konva';

function NodeTypeValue({
  nodeWidth,
  typeText,
  valueText,
  fontFamily,
  fontSize,
  strokeWidth,
  radius,
  padding,
  textTypeColor,
  textValueColor,
  fillTypeColor,
  fillValueColor,
  strokeColor,
  pointerDirection,
  pointerWidth,
  pointerHeight,
}) {
  const typeWidth = useMemo(() => (
    new Konva.Text({
      text: typeText,
      fontFamily,
      fontSize,
    }).getTextWidth()
  ), [typeText, fontFamily, fontSize]);

  const valueWidth = useMemo(() => (
    new Konva.Text({
      text: valueText,
      fontFamily,
      fontSize,
    }).getTextWidth()
  ), [valueText, fontFamily, fontSize]);

  const labelWidth = useMemo(() => {
    if (typeText && valueText) {
      return (valueWidth + typeWidth + 4 * padding);
    }
    if (typeText) {
      return (typeWidth + 2 * padding);
    }
    if (valueText) {
      return (valueWidth + 2 * padding);
    }
    return 0;
  }, [valueWidth, typeWidth, padding]);

  const typeX = useMemo(() => {
    const middle = (nodeWidth - labelWidth) / 2;
    if (typeText && valueText) {
      return ((valueWidth + 2 * padding) + middle);
    }
    return middle;
  }, [nodeWidth, valueWidth, labelWidth, padding]);
  const typeY = useMemo(() => (-(padding + fontSize) * 2), [fontSize]);

  const valueX = useMemo(() => {
    const middle = (nodeWidth - labelWidth) / 2;
    return middle;
  }, [nodeWidth, labelWidth]);
  const valueY = useMemo(() => (-(padding + fontSize) * 2), [fontSize]);

  const pointerX = useMemo(() => (nodeWidth / 2), [nodeWidth]);
  const pointerY = useMemo(() => (-(fontSize)), [fontSize]);

  const typeCornerRadius = useMemo(() => {
    if (typeText && valueText) {
      return [0, radius, radius, 0];
    }
    return [radius, radius, radius, radius];
  }, [typeText, valueText]);

  const valueCornerRadius = useMemo(() => {
    if (typeText && valueText) {
      return [radius, 0, 0, radius];
    }
    return [radius, radius, radius, radius];
  }, [typeText, valueText]);

  return (
    <>
      {typeText !== '' || valueText !== '' ? (
        <Label
          x={pointerX}
          y={pointerY}
        >
          <Tag
            fill="black"
            stroke="black"
            pointerDirection={pointerDirection}
            pointerWidth={pointerWidth}
            pointerHeight={pointerHeight}
          />
        </Label>
      ) : null}
      {typeText !== '' ? (
        <Label
          x={typeX}
          y={typeY}
        >
          <Tag
            fill={fillTypeColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            cornerRadius={typeCornerRadius}
          />
          <Text
            fill={textTypeColor}
            fontFamily={fontFamily}
            fontSize={fontSize}
            text={typeText}
            padding={padding}
          />
        </Label>
      ) : null}
      {valueText !== '' ? (
        <Label
          x={valueX}
          y={valueY}
        >
          <Tag
            fill={fillValueColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            cornerRadius={valueCornerRadius}
          />
          <Text
            fill={textValueColor}
            fontFamily={fontFamily}
            fontSize={fontSize}
            text={valueText}
            padding={padding}
          />
        </Label>
      ) : null}
    </>
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
  textTypeColor: PropTypes.string,
  textValueColor: PropTypes.string,
  fillTypeColor: PropTypes.string,
  fillValueColor: PropTypes.string,
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
  fillTypeColor: '#3f51b5',
  fillValueColor: '#000000',
  textTypeColor: '#ffffff',
  textValueColor: '#ffffff',
  strokeColor: '#3f51b5',
  strokeWidth: 0,
  pointerDirection: 'down',
  pointerWidth: 3,
  pointerHeight: 4,
  radius: 5,
  padding: 5,
};

export default NodeTypeValue;
