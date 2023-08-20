import React from 'react';
import type {RenderHTMLProps} from 'react-native-render-html';
import BaseRenderHTML from 'react-native-render-html';

type Props = RenderHTMLProps;
export default function RenderHTML({...props}: Props) {
  return <BaseRenderHTML {...props} />;
}
