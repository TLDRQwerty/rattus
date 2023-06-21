import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Image, View} from 'react-native';
import useList from '../../hooks/use-list';
import type {RootDrawerScreenProps} from '../../navigation/DrawerNavigator';
import Status from '../../Status';
import Text from '../../ui/Text';
import Profile from './Profile';
import type {Account as AccountType, Status as StatusType} from '../../types';
import Pressable from '../../ui/Pressable';
import tw from '../../tailwind';
import {ScrollView} from 'react-native-gesture-handler';
import useAuthQuery from '../../hooks/use-auth-query';

export const PROFILE_TAB = {
  POSTS: 'POSTS',
  FOLLOWING: 'FOLLOWING',
  FOLLOWERS: 'FOLLOWERS',
} as const;
export type PROFILE_TAB = (typeof PROFILE_TAB)[keyof typeof PROFILE_TAB];

const PROFILE_TAB_TO_URL = {
  [PROFILE_TAB.POSTS]: (id: string) => `api/v1/accounts/${id}/statuses`,
  [PROFILE_TAB.FOLLOWING]: (id: string) => `api/v1/accounts/${id}/following`,
  [PROFILE_TAB.FOLLOWERS]: (id: string) => `api/v1/accounts/${id}/followers`,
};

function Account({avatar, username, url, id}: AccountType) {
  const navigation = useNavigation();
  return (
    <Pressable
      style={tw`flex-row gap-2 p-2`}
      onPress={() =>
        navigation.navigate('Root', {
          screen: 'ProfileOverview',
          params: {
            id,
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

const STICKY_HEADER = [0];
export default function ProfileNavigator({
  route,
  navigation,
}: RootDrawerScreenProps<'ProfileOverview'>) {
  const oldId = useRef<null | string>(null);
  const {id, tab} = route.params;
  const {data: profile, isLoading} = useAuthQuery<AccountType>(
    ['api/v1/accounts', id],
    `api/v1/accounts/${id}`,
  );
  const [profileTab, setProfileTab] = useState<PROFILE_TAB>(
    tab ?? PROFILE_TAB.POSTS,
  );

  useEffect(() => {
    if (oldId.current !== id) {
      oldId.current = id;
      setProfileTab(PROFILE_TAB.POSTS);
    }
  }, [id]);

  const {Component} = useList<
    typeof profileTab extends typeof PROFILE_TAB.POSTS
      ? StatusType
      : AccountType
  >({
    nestedScrollEnabled: true,
    endpoint: PROFILE_TAB_TO_URL[profileTab](id),
    stickyHeaderIndices: STICKY_HEADER,
    ListHeaderComponent: profile ? (
      <View style={tw`flex-row justify-around py-2`}>
        <Pressable
          onPress={() => {
            setProfileTab(PROFILE_TAB.POSTS);
          }}>
          <Text style={tw.style({underline: profileTab === PROFILE_TAB.POSTS})}>
            {profile.statuses_count} Posts
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setProfileTab(PROFILE_TAB.FOLLOWING);
          }}>
          <Text
            style={tw.style({underline: profileTab === PROFILE_TAB.FOLLOWING})}>
            {profile.following_count} Following
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setProfileTab(PROFILE_TAB.FOLLOWERS);
          }}>
          <Text
            style={tw.style({underline: profileTab === PROFILE_TAB.FOLLOWERS})}>
            {profile.followers_count} Followers
          </Text>
        </Pressable>
      </View>
    ) : null,
    renderItem: item =>
      profileTab === PROFILE_TAB.POSTS ? (
        <Status {...item.item} />
      ) : (
        <Account {...item.item} />
      ),
  });

  useEffect(() => {
    if (profile) {
      navigation.setOptions({
        title:
          profile.display_name !== '' ? profile.display_name : profile.username,
      });
    }
  }, [profile, navigation]);

  return (
    <ScrollView>
      {isLoading || !profile ? (
        <ActivityIndicator />
      ) : (
        <Profile profile={profile} />
      )}
      {Component}
    </ScrollView>
  );
}
