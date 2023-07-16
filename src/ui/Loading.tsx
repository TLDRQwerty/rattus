import React from 'react';
import type {ActivityIndicatorProps} from 'react-native';
import {ActivityIndicator} from 'react-native';
import tw from '../tailwind';

export default function Loading({
  color,
  ...rest
}: ActivityIndicatorProps): JSX.Element {
  return (
    <ActivityIndicator color={tw`text-primary-400`?.color ?? color} {...rest} />
  );
}
