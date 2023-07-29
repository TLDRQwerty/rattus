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
      true: 'text-gray-600',
    },
    size: {
      '2xl': 'text-2xl',
      xl: 'text-xl',
      lg: 'text-lg',
      md: 'text-md',
      sm: 'text-sm',
      xs: 'text-xs',
    },
  },
  defaultVariants: {
    subtext: false,
    size: 'md',
  },
});

type Props = TextProps & VariantProps<typeof text>;

export default function Text({subtext, size, style, ...rest}: Props) {
  return (
    <RNText
      style={StyleSheet.compose(tw.style(text({subtext, size})), style)}
      {...rest}
    />
  );
}
