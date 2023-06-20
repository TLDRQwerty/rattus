import React from 'react';
import type {TextInputProps} from 'react-native';
import {StyleSheet, TextInput as RNTextInput} from 'react-native';
import tw from '../tailwind';

type Props = TextInputProps;

export default function TextInput({style, ...props}: Props) {
  return (
    <RNTextInput
      style={StyleSheet.compose(
        tw`border rounded bg-gray-200 text-black h-10`,
        style,
      )}
      {...props}
    />
  );
}
