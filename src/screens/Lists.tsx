import React from 'react';
import {View, type ListRenderItem} from 'react-native';
import useList from '../hooks/use-list';
import type {List as ListType, Account as AccountType} from '../types';
import Text from '../ui/Text';
import Tabs from '../ui/Tabs';
import type {RootNavigationStackScreenProps} from '../navigation';
import BottomSheet from '../ui/BottomSheet';
import Pressable from '../ui/Pressable';
import Account from '../ui/Account';
import tw from '../tailwind';

export default function List({
  navigation,
}: RootNavigationStackScreenProps<'Lists'>): JSX.Element {
  const {Component} = useList<ListType>({
    renderItem: ({item}) => (
      <Pressable
        onPress={() => {
          navigation.navigate('ListItem', {id: item.id});
        }}>
        <Text>{item.title}</Text>
      </Pressable>
    ),
    endpoint: 'api/v1/lists',
    itemStyle: tw`flex-row gap-2 py-2 border-gray-200 bg-white border-b items-center`,
  });

  return Component;
}

export function ListItem({
  navigation,
  route,
}: RootNavigationStackScreenProps<'ListItem'>): JSX.Element {
  const {id} = route.params;
  return (
    <BottomSheet snapPoints={['50%', '100%']} onClose={navigation.goBack}>
      <Tabs>
        <Tabs.Tab title={<Text>Posts</Text>}>
          <ListPosts id={id} />
        </Tabs.Tab>
        <Tabs.Tab title={<Text>Accounts</Text>}>
          <ListAccounts id={id} />
        </Tabs.Tab>
      </Tabs>
    </BottomSheet>
  );
}

function ListPosts({id}: {id: string}): JSX.Element {
  return (
    <View>
      <Text>Todo</Text>
    </View>
  );
}

function ListAccounts({id}: {id: string}): JSX.Element {
  const {Component} = useList<AccountType>({
    renderItem: AccountItem,
    endpoint: `/api/v1/lists/${id}/accounts`,
  });
  return Component;
}

const AccountItem: ListRenderItem<AccountType> = ({item}) => {
  return (
    <Account
      id={item.id}
      username={item.username}
      fullUsername={item.acct}
      avatarUri={item.avatar_static}
    />
  );
};
