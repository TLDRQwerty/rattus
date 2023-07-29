import type {ReactNode} from 'react';
import React from 'react';
import type {NativeStackHeaderProps} from '@react-navigation/native-stack';
import type {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import BaseText from './Text';
import {View} from 'react-native';
import Pressable from './Pressable';
import {ArrowLeft} from './Icons';
import tw from '../tailwind';

type Props = {children?: ReactNode} & (
  | NativeStackHeaderProps
  | BottomTabHeaderProps
);

function Header({
  navigation,
  route,
  children,
  options,
}: Props): JSX.Element | null {
  const {name} = route;
  const {headerShown} = options;
  if (headerShown === false) {
    return null;
  }
  return (
    <View style={tw`flex-row gap-4 items-center`}>
      {navigation.canGoBack() && (
        <Pressable onPress={navigation.goBack}>
          <ArrowLeft />
        </Pressable>
      )}
      {children ?? <Text>{name}</Text>}
    </View>
  );
}

function Text({children}: {children: ReactNode}) {
  return <BaseText size="xl">{children}</BaseText>;
}

export default Object.assign(Header, {Text});
