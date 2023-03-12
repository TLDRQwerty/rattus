import React from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps,
} from 'react-native';
import tw from '../tailwind';

interface Props extends TextInputProps {}

export default function TextInput({style, ...props}: Props) {
  return (
    <RNTextInput
      style={StyleSheet.compose(tw`border rounded bg-gray-200 h-10`, style)}
      {...props}
    />
  );
}
