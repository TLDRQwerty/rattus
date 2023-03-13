import React from 'react';
import Svg, {Line, Path} from 'react-native-svg';
import {TextStyle} from 'react-native/types';

interface Props {
  strokeWidth?: number;
  style?: TextStyle;
}

const getDefaultParamsFromStyle = (style?: TextStyle) => {
  const width = style?.width ?? 24;
  const height = style?.height ?? 24;
  const stroke = style?.color ?? '#000000';
  const fill = style?.backgroundColor ?? 'none';
  return {stroke, width, height, fill};
};

export function MessageCircle({strokeWidth = 1.5, style}: Props) {
  const {width, height, stroke, fill} = getDefaultParamsFromStyle(style);
  return (
    <Svg
      style={style}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      stroke-width={strokeWidth}
      stroke={stroke}
      fill={fill}
      stroke-linecap="round"
      stroke-linejoin="round">
      <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <Path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />
      <Line x1="12" y1="12" x2="12" y2="12.01" />
      <Line x1="8" y1="12" x2="8" y2="12.01" />
      <Line x1="16" y1="12" x2="16" y2="12.01" />
    </Svg>
  );
}

export function Heart({style, strokeWidth = 1.5}: Props) {
  const {width, height, stroke, fill} = getDefaultParamsFromStyle(style);
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      stroke-width={strokeWidth}
      stroke={stroke}
      fill={fill}
      stroke-linecap="round"
      stroke-linejoin="round">
      <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <Path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
    </Svg>
  );
}

export function Repeat({strokeWidth = 1.5, style}: Props) {
  const {width, height, stroke, fill} = getDefaultParamsFromStyle(style);
  return (
    <Svg
      style={style}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      stroke-width={strokeWidth}
      stroke={stroke}
      fill={fill}
      stroke-linecap="round"
      stroke-linejoin="round">
      <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <Path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" />
      <Path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" />
    </Svg>
  );
}
