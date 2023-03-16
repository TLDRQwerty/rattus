import {CommonActions, useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  Text,
  View,
  VirtualizedList,
} from 'react-native';
import useInfiniteQuery from '../../hooks/use-infinite-query';
import useVirtualizedList from '../../hooks/use-virtualized-list';
import {ProfileScreenParams} from '../../navigation/ProfileNavigator';
import tw from '../../tailwind';
import {Account as AccountType} from '../../types';
import Pressable from '../../ui/Pressable';

export default function Following({route}: ProfileScreenParams<'Following'>) {
  const {id} = route.params;
  const {Component} = useVirtualizedList<AccountType>({
    endpoint: `api/v1/accounts/${id}/following`,
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
