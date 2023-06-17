import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, Text, View} from 'react-native';
import useList from '../../hooks/use-list';
import type {ProfileScreenParams} from '../../navigation/ProfileNavigator';
import tw from '../../tailwind';
import type {Account as AccountType} from '../../types';
import Pressable from '../../ui/Pressable';

export default function Followers({route}: ProfileScreenParams<'Followers'>) {
  const {id} = route.params;
  const {Component} = useList<AccountType>({
    endpoint: `api/v1/accounts/${id}/followers`,
    renderItem: item => <Account {...item.item} />,
  });
  return Component;
}

function Account({avatar, username, url, id}: AccountType) {
  const navigation = useNavigation();
  return (
    <Pressable
      style={tw`flex-row gap-2`}
      onPress={() =>
        navigation.navigate('Root', {
          screen: 'ProfileOverview',
          params: {
            id,
            screen: 'PostsStack',
            params: {
              id,
              screen: 'Posts',
              params: {
                id,
              },
            },
          },
        })
      }>
      <Image source={{uri: avatar}} style={tw`rounded-lg w-8`} />
      <View>
        <Text>{username}</Text>
        <Text>{url}</Text>
      </View>
    </Pressable>
  );
}
