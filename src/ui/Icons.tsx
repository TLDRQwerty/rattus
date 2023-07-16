import type {ReactNode} from 'react';
import React from 'react';
import Svg, {Line, Path} from 'react-native-svg';
import type {TextStyle} from 'react-native/types';

export interface Props {
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

function createIcon(innerPath: ReactNode) {
  return ({strokeWidth = 1.5, style}: Props) => {
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
        {innerPath}
      </Svg>
    );
  };
}

export const MessageCircle = createIcon(
  <>
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />
    <Line x1="12" y1="12" x2="12" y2="12.01" />
    <Line x1="8" y1="12" x2="8" y2="12.01" />
    <Line x1="16" y1="12" x2="16" y2="12.01" />
  </>,
);

export const Heart = createIcon(
  <>
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
  </>,
);

export const Repeat = createIcon(
  <>
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" />
    <Path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" />
  </>,
);

export const Home = createIcon(
  <>
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M5 12l-2 0l9 -9l9 9l-2 0" />
    <Path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
    <Path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
  </>,
);

export const Profile = createIcon(
  <>
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
    <Path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
  </>,
);

export const Search = createIcon(
  <>
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <Path d="M21 21l-6 -6" />
  </>,
);

export const Notification = createIcon(
  <>
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M10 6h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
    <Path d="M17 7m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
  </>,
);

export const Planet = createIcon(
  <>
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M18.816 13.58c2.292 2.138 3.546 4 3.092 4.9c-.745 1.46 -5.783 -.259 -11.255 -3.838c-5.47 -3.579 -9.304 -7.664 -8.56 -9.123c.464 -.91 2.926 -.444 5.803 .805" />
    <Path d="M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
  </>,
);

export const Affiliate = createIcon(
  <>
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M5.931 6.936l1.275 4.249m5.607 5.609l4.251 1.275" />
    <Path d="M11.683 12.317l5.759 -5.759" />
    <Path d="M5.5 5.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0" />
    <Path d="M18.5 5.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0" />
    <Path d="M18.5 18.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0" />
    <Path d="M8.5 15.5m-4.5 0a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0" />
  </>,
);

export const SquarePlus = createIcon(
  <>
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
    <Path d="M9 12l6 0" />
    <Path d="M12 9l0 6" />
  </>,
);

export const Selector = createIcon(
  <>
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M8 9l4 -4l4 4" />
    <Path d="M16 15l-4 4l-4 -4" />
  </>,
);

export const CornerDownRight = createIcon(
  <>
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M6 6v6a3 3 0 0 0 3 3h10l-4 -4m0 8l4 -4" />
  </>,
);

export const Photo = createIcon(
  <>
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M15 8h.01" />
    <Path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" />
    <Path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" />
    <Path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" />
  </>,
);
