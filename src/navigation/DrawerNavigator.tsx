import React from 'react';
import {View, Text, Image} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import PublicTimeline from '../screens/PublicTimeline';
import Status from '../screens/Status';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {RootStackParamList} from '.';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useUserStore} from '../stores/use-user';
import {Account} from '../types';
import {useQuery} from '@tanstack/react-query';
import tw from '../tailwind';
import ProfileNavigator, {
  ProfileScreenParams,
  ProfileStackParamList,
} from './ProfileNavigator';
import LocalTimeline from '../screens/LocalTimeline';
import ExploreTimeline from '../screens/ExploreTimeline';
import Pressable from '../ui/Pressable';
import Notifications from '../screens/Notifications';

const Drawer = createDrawerNavigator<DrawerNavParamList>();

export default function DrawerNavigator() {
  const renderDrawerContent = (props: DrawerContentComponentProps) => {
    return <CustomDrawerContent {...props} />;
  };
  return (
    <Drawer.Navigator drawerContent={renderDrawerContent}>
      <Drawer.Screen name="PublicTimeline" component={PublicTimeline} />
      <Drawer.Screen name="LocalTimeline" component={LocalTimeline} />
      <Drawer.Screen name="ExploreTimeline" component={ExploreTimeline} />
      <Drawer.Screen name="Notifications" component={Notifications} />
      <Drawer.Screen name="Status" component={Status} />
      <Drawer.Screen name="ProfileOverview" component={ProfileNavigator} />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent({navigation}: DrawerContentComponentProps) {
  const [instance, code, accessToken] = useUserStore(s => [
    s.instance,
    s.code,
    s.accessToken,
  ]);

  const {data} = useQuery<Account>(
    ['/api/v1/accounts/verify_credentials', accessToken, instance],
    async () => {
      if (accessToken == null || instance == null) {
        throw Error();
      }
      const response = await fetch(
        `https://${instance}/api/v1/accounts/verify_credentials`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (!response.ok) {
        throw Error();
      }
      return response.json();
    },
  );
  return (
    <View style={tw`flex-1`}>
      <Text style={tw`font-bold text-xl`}>Rattus</Text>
      <Text>A Mastodon client</Text>
      <Pressable
        style={tw`justify-center items-center h-12 bg-gray-200`}
        onPress={() => navigation.getParent()?.navigate('Instance')}>
        <Text>Connect to instance</Text>
      </Pressable>
      <Pressable
        style={tw`justify-center items-center h-12 bg-gray-200`}
        onPress={() => navigation.navigate('LocalTimeline')}>
        <Text>Local</Text>
      </Pressable>
      <Pressable
        style={tw`justify-center items-center h-12 bg-gray-200`}
        onPress={() => navigation.navigate('ExploreTimeline')}>
        <Text>Explore</Text>
      </Pressable>
      <Pressable
        style={tw`justify-center items-center h-12 bg-gray-200`}
        onPress={() => navigation.navigate('Notifications')}>
        <Text>Notifications</Text>
      </Pressable>
      {data && (
        <>
          <View style={tw`flex-1`} />
          <Pressable
            onPress={() =>
              navigation.navigate('ProfileOverview', {
                id: data.id,
                screen: 'PostsStack',
                params: {id: data.id, screen: 'Posts', params: {id: data.id}},
              })
            }
            style={tw`flex-row items-center pb-2 pl-2`}>
            <Image
              source={{uri: data?.avatar}}
              style={tw`w-8 h-8 rounded-lg`}
            />
            <Text numberOfLines={1} ellipsizeMode="tail">
              <Text style={tw`text-primary-600`}>@{data.username}</Text>
              <Text>@{instance}</Text>
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

export type DrawerNavParamList = {
  PublicTimeline: undefined;
  LocalTimeline: undefined;
  ExploreTimeline: undefined;
  Notifications: undefined;
  Status: {id: string};
  ProfileOverview: NavigatorScreenParams<ProfileStackParamList> & {id: string};
};

export type RootDrawerScreenProps<Screen extends keyof DrawerNavParamList> =
  CompositeScreenProps<
    DrawerScreenProps<DrawerNavParamList, Screen>,
    NativeStackScreenProps<RootStackParamList, 'Root'>
  >;
