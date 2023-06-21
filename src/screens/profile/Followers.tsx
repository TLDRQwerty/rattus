import React from 'react';
import useList from '../../hooks/use-list';
import type {ProfileScreenParams} from '../../navigation/ProfileNavigator';
import type {Account as AccountType} from '../../types';
import Account from '../../ui/Account';

export default function Followers({route}: ProfileScreenParams<'Followers'>) {
  const {id} = route.params;
  const {Component} = useList<AccountType>({
    endpoint: `api/v1/accounts/${id}/followers`,
    renderItem: ({item}) => (
      <Account
        id={item.id}
        avatarUri={item.avatar_static}
        fullUsername={item.acct}
        username={item.username}
      />
    ),
  });
  return Component;
}
