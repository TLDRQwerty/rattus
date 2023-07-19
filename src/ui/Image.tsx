import type {ReactNode} from 'react';
import React, {useLayoutEffect, useState} from 'react';
import type {ImageProps} from 'react-native';
import {
  Image as RNImage,
  Modal,
  View,
  Text,
  useWindowDimensions,
} from 'react-native';
import tw from '../tailwind';
import Pressable from './Pressable';

interface Props extends ImageProps {
  disableModal?: boolean;
  children?: ReactNode;
}

export default function Image({disableModal, children, ...rest}: Props) {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<null | {width: number; height: number}>(
    null,
  );
  const dimensions = useWindowDimensions();
  useLayoutEffect(() => {
    if (typeof rest.source === 'string') {
      RNImage.getSize(rest.source, (width, height) => setSize({width, height}));
    }
  }, [rest.source]);
  return (
    <>
      <Pressable onPress={disableModal ? undefined : () => setOpen(true)}>
        <RNImage {...rest} />
      </Pressable>
      <Modal
        transparent
        style={tw`w-screen h-screen`}
        visible={open}
        onRequestClose={() => setOpen(false)}
        onDismiss={() => setOpen(false)}>
        <View style={tw`w-screen h-screen bg-gray-600/25`}>
          <View style={tw`m-auto items-center`}>
            <RNImage
              {...rest}
              style={Object.assign({}, rest.style, {
                width: Math.min(
                  dimensions.width,
                  Math.max(size?.width ?? 0, dimensions.width / 3),
                ),
                height: Math.min(
                  dimensions.height,
                  Math.max(size?.height ?? 0, dimensions.height / 3),
                ),
                aspectRatio: (size?.width ?? 1) / (size?.height ?? 1),
              })}
              resizeMode="contain"
            />
            {children}
            <Pressable
              style={tw`mt-16 rounded bg-gray-900 p-2 mx-8`}
              onPress={() => setOpen(false)}>
              <Text style={tw`text-lg text-center text-white`}>Dismiss</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
