import React from 'react';
import {Text as RNText} from 'react-native';
import type {TextProps} from 'react-native';

type Props = TextProps;

export default function Text(props: Props) {
  return <RNText {...props} />;
}
