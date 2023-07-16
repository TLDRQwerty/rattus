import React from 'react';
import {Text as RNText, StyleSheet} from 'react-native';
import type {TextProps} from 'react-native';
import tw from '../tailwind';
import type {VariantProps} from 'class-variance-authority';
import {cva} from 'class-variance-authority';

const text = cva('', {
  variants: {
    subtext: {
      false: 'text-black',
      true: 'text-gray-400',
    },
  },
  defaultVariants: {
    subtext: false,
  },
});

type Props = TextProps & VariantProps<typeof text>;

export default function Text({subtext, style, ...rest}: Props) {
  return (
    <RNText
      style={StyleSheet.compose(tw.style(text({subtext})), style)}
      {...rest}
    />
  );
}
