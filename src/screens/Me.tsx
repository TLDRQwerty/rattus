import React from 'react';
import {View, useWindowDimensions} from 'react-native';
import {useUserStore} from '../stores/use-user';
import Text from '../ui/Text';
import Pressable from '../ui/Pressable';
import {useNavigation} from '@react-navigation/native';
import useAuthQuery from '../hooks/use-auth-query';
import Loading from '../ui/Loading';
import tw from '../tailwind';
import Image from '../ui/Image';
import type {Account} from '../types';
import RenderHTML from 'react-native-render-html';
import ProfileInner from '../ProfileInner';

export default function Me(): JSX.Element {
  const accessToken = useUserStore(s => s.accessToken);
  if (accessToken) {
    return <LoggedIn />;
  } else {
    return <NotLoggedIn />;
  }
}

function NotLoggedIn(): JSX.Element {
  const navigation = useNavigation();
  return (
    <View>
      <Text>You are not logged in</Text>
      <Pressable onPress={() => navigation.navigate('InstancePreview')}>
        <Text>Log in?</Text>
      </Pressable>
    </View>
  );
}

function LoggedIn(): JSX.Element {
  const {data: profile, isLoading} = useAuthQuery<Account>(
    ['api/v1/accounts/verify_credentials'],
    'api/v1/accounts/verify_credentials',
  );
  if (isLoading || !profile) {
    return <Loading />;
  }
  return <ProfileInner profile={profile} />;
}
