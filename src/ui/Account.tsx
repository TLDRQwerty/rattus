import React from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Text from './Text';
import Image from './Image';
import tw from '../tailwind';
import Pressable from './Pressable';

interface Props {
  username: string;
  fullUsername: string;
  avatarUri: string;
  id: string;
}

export default function Account({
  username,
  fullUsername,
  avatarUri,
  id,
}: Props) {
  const navigation = useNavigation();
  return (
    <Pressable
      style={tw`flex-row gap-2 items-center min-h-8`}
      onPress={() =>
        navigation.navigate('Profile', {
          id,
        })
      }>
      <Image source={{uri: avatarUri}} style={tw`w-8 h-8 rounded-lg`} />
      <View>
        <Text>{username}</Text>
        <Text subtext>{fullUsername}</Text>
      </View>
    </Pressable>
  );
}
