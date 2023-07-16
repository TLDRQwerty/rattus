import React from 'react';
import type { TextInputProps } from 'react-native';
import { View, TextInput } from 'react-native';
import { Photo } from './Icons';
import Pressable from './Pressable';

type Props = TextInputProps;

export default function RichTextEditor({ ...rest }: Props): JSX.Element {
  return (
    <View>
      <TextInput {...rest} />
      <Pressable>
        <Photo />
      </Pressable>
    </View>
  );
}
