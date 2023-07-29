import React, {useEffect, useRef} from 'react';
import type {RootNavigationStackScreenProps} from '../navigation';
import type {ListRenderItem} from 'react-native';
import Text from '../ui/Text';
import Tabs from '../ui/Tabs';
import useList from '../hooks/use-list';
import type {Account as AccountType} from '../types';
import Account from '../ui/Account';
import BottomSheet from '../ui/BottomSheet';

export default function FollowingAndFollowers({
  route,
  navigation,
}: RootNavigationStackScreenProps<'FollowingAndFollowers'>): JSX.Element {
  const {id} = route.params;

  const onClose = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <BottomSheet snapPoints={['50%', '100%']} onClose={onClose}>
      <Tabs>
        <Tabs.Tab title={<Text>Following</Text>}>
          <Following id={id} />
        </Tabs.Tab>
        <Tabs.Tab title={<Text>Followers</Text>}>
          <Followers id={id} />
        </Tabs.Tab>
      </Tabs>
    </BottomSheet>
  );
}

function Followers({id}: {id: string}): JSX.Element {
  const {Component} = useList<AccountType>({
    endpoint: `/api/v1/accounts/${id}/followers`,
    renderItem: Item,
  });
  return Component;
}

function Following({id}: {id: string}): JSX.Element {
  const {Component} = useList<AccountType>({
    endpoint: `/api/v1/accounts/${id}/following`,
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
