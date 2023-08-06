import React from 'react'
import tw from '../tailwind';
import {Heart} from '../ui/Icons';
import Pressable from '../ui/Pressable';
import Text from '../ui/Text';

interface Props {
  id: string;
  favourited: boolean;
  favourites_count: number;
}
export default function Favourite({
  id,
  favourited,
  favourites_count,
}: Props): JSX.Element {
  return (
    <Pressable style={tw`flex-row items-center`} onPress={console.log}>
      <Heart style={tw.style(favourited && 'text-primary-600')} />
      <Text>{favourites_count}</Text>
    </Pressable>
  );
}
