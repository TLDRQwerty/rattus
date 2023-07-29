import React from 'react';
import type {TextInputProps} from 'react-native';
import {StyleSheet, TextInput as RNTextInput} from 'react-native';
import tw from '../tailwind';
import type {VariantProps} from 'class-variance-authority';
import {cva} from 'class-variance-authority';

const textInput = cva('', {
  variants: {
    form: {true: 'border rounded bg-gray-200 text-black h-10', false: ''},
  },
  defaultVariants: {
    form: false,
  },
});

type Props = TextInputProps & VariantProps<typeof textInput>;

export default function TextInput({style, cursorColor, form, ...props}: Props) {
  return (
    <RNTextInput
      cursorColor={tw`text-primary-400`?.color ?? cursorColor}
      style={StyleSheet.compose(tw.style(textInput({form})), style)}
      {...props}
    />
  );
}
