import React from 'react';
import {View} from 'react-native';
import useAuthQuery from '../hooks/use-auth-query';
import type {Account as AccountType} from '../types';
import type {RootNavigationStackScreenProps} from '../navigation';
import ProfileInner from '../ProfileInner';
import Loading from '../ui/Loading';

export default function Profile({
  route,
}: RootNavigationStackScreenProps<'Profile'>): JSX.Element {
  const {id} = route.params;
  const {data: profile, isLoading} = useAuthQuery<AccountType>(
    ['api/v1/accounts', id],
    `api/v1/accounts/${id}`,
  );
  if (isLoading || !profile) {
    return <Loading />;
  }
  return <ProfileInner profile={profile} />;
}
