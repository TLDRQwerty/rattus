import React from 'react';
import type {RenderHTMLProps} from 'react-native-render-html';
import BaseRenderHTML from 'react-native-render-html';
import tw from '../tailwind';

type Props = RenderHTMLProps;
export default function RenderHTML({...props}: Props) {
  return <BaseRenderHTML {...props} />;
}
