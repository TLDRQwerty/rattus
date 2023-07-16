import React from 'react';
import {Text as RNText, StyleSheet} from 'react-native';
import type {TextProps} from 'react-native';
import tw from '../tailwind';

type Props = TextProps;

export default function Text({style, ...rest}: Props) {
  return <RNText style={StyleSheet.compose(tw`text-black`, style)} {...rest} />;
}
