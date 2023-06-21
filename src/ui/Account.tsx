import React from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Text from './Text';
import Image from './Image';
import tw from '../tailwind';
import Pressable from './Pressable';
import {PROFILE_TAB} from '../screens/profile/ProfileNavigator';

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
      style={tw`flex-row flex-1 gap-2 items-center min-h-8`}
      onPress={() =>
        navigation.navigate('Root', {
          screen: 'ProfileOverview',
          params: {
            id,
            tab: PROFILE_TAB.POSTS,
          },
        })
      }>
      <Image source={{uri: avatarUri}} style={tw`w-8 h-8 rounded-lg`} />
      <View>
        <Text>{username}</Text>
        <Text>{fullUsername}</Text>
      </View>
    </Pressable>
  );
}
