import React from 'react';
import type {ListRenderItem} from 'react-native';
import {View} from 'react-native';
import Text from '../ui/Text';
import type {RootNavigationStackScreenProps} from '../navigation';
import tw from '../tailwind';
import useList from '../hooks/use-list';
import type {Account as AccountType} from '../types';
import Account from '../ui/Account';
import Tabs from '../ui/Tabs';
import BottomSheet from '../ui/BottomSheet';

export default function FavoritedAndBoosted({
  navigation,
  route,
}: RootNavigationStackScreenProps<'FavoritedAndBoosted'>): JSX.Element {
  const {id} = route.params;
  return (
    <BottomSheet snapPoints={['50%', '100%']} onClose={navigation.goBack}>
      <Tabs>
        <Tabs.Tab title={<Text>Favorited</Text>}>
          <Favourited id={id} />
        </Tabs.Tab>
        <Tabs.Tab title={<Text>Boosted</Text>}>
          <Boosted id={id} />
        </Tabs.Tab>
      </Tabs>
    </BottomSheet>
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
