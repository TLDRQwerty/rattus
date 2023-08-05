import React from 'react';
import Modal from '../ui/Modal';
import type {ListRenderItem} from 'react-native';
import {View} from 'react-native';
import Text from '../ui/Text';
import type {RootNavigationStackScreenProps} from '../navigation';
import tw from '../tailwind';
import useList from '../hooks/use-list';
import type {Account as AccountType} from '../types';
import Account from '../ui/Account';
import Tabs from '../ui/Tabs';
import Pressable from '../ui/Pressable';

export default function FavoritedAndBoosted({
  navigation,
  route,
}: RootNavigationStackScreenProps<'FavoritedAndBoosted'>): JSX.Element {
  const {id} = route.params;
  return (
    <Modal
      visible
      transparent
      onDismiss={navigation.goBack}
      onRequestClose={navigation.goBack}>
      <Pressable onPress={navigation.goBack} style={tw`bg-gray-200/25 absolute inset-0`} />
      <View style={tw`bg-white m-auto min-w-3/4 min-h-1/2`}>
        <Tabs>
          <Tabs.Tab title={<Text>Favorited</Text>}>
            <Favourited id={id} />
          </Tabs.Tab>
          <Tabs.Tab title={<Text>Boosted</Text>}>
            <Boosted id={id} />
          </Tabs.Tab>
        </Tabs>
      </View>
    </Modal>
  );
}

function Favourited({id}: {id: string}) {
  const {Component} = useList<AccountType>({
    endpoint: `/api/v1/statuses/${id}/favourited_by`,
    renderItem: Item,
  });

  return Component;
}

function Boosted({id}: {id: string}) {
  const {Component} = useList<AccountType>({
    endpoint: `/api/v1/statuses/${id}/reblogged_by`,
    renderItem: Item,
  });

  return Component;
}

const Item: ListRenderItem<AccountType> = ({item}) => {
  return (
    <Account
      id={item.id}
      username={item.username}
      fullUsername={item.acct}
      avatarUri={item.avatar_static}
    />
  );
};
