import React from 'react';
import {Image as RNImage, ImageProps} from 'react-native';
interface Props extends ImageProps {}

export default function Image({...rest}: Props) {
  return <RNImage {...rest} />;
}
