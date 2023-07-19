import React from 'react';
import type {GestureResponderEvent} from 'react-native';
import {View} from 'react-native';
import type {RootNavigationStackScreenProps} from '../navigation';
import Pressable from '../ui/Pressable';
import Text from '../ui/Text';
import {Logout} from '../ui/Icons';
import tw from '../tailwind';

export default function Settings({}: RootNavigationStackScreenProps<'Settings'>): JSX.Element {
  return (
    <View>
      <Row Icon={Logout} text="Logout" onPress={console.log} />
    </View>
  );
}

function Row({
  text,
  onPress,
  Icon,
}: {
  text: string;
  onPress: ((event: GestureResponderEvent) => void) | null | undefined;
  Icon: typeof Logout;
}): JSX.Element {
  return (
    <Pressable style={tw`flex-row gap-2 py-2 border-gray-200 bg-white border-b items-center`} onPress={onPress}>
      <Icon />
      <Text>{text}</Text>
    </Pressable>
  );
}
