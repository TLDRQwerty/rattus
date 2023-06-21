import React from 'react';
import {View} from 'react-native';
import type {
  DrawerContentComponentProps,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import {createDrawerNavigator} from '@react-navigation/drawer';
import PublicTimeline from '../screens/PublicTimeline';
import Status from '../screens/Status';
import type {CompositeScreenProps} from '@react-navigation/native';
import {NavigatorScreenParams, useNavigation} from '@react-navigation/native';
import type {RootStackParamList} from '.';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useUserStore} from '../stores/use-user';
import type {Account} from '../types';
import tw from '../tailwind';
// import type {ProfileStackParamList} from './ProfileNavigator';
// import ProfileNavigator from './ProfileNavigator';
import LocalTimeline from '../screens/LocalTimeline';
import ExploreTimeline from '../screens/ExploreTimeline';
import Pressable from '../ui/Pressable';
import Notifications from '../screens/Notifications';
import useAuthQuery from '../hooks/use-auth-query';
import Text from '../ui/Text';
import Image from '../ui/Image';
import ProfileNavigator, { PROFILE_TAB } from '../screens/profile/ProfileNavigator';

const Drawer = createDrawerNavigator<DrawerNavParamList>();

export default function DrawerNavigator() {
  const renderDrawerContent = (props: DrawerContentComponentProps) => {
    return <CustomDrawerContent {...props} />;
  };
  const instanceName = useUserStore(s => s.instance);
  return (
    <Drawer.Navigator drawerContent={renderDrawerContent}>
      <Drawer.Screen
        options={{title: 'Public'}}
        name="PublicTimeline"
        component={PublicTimeline}
      />
      <Drawer.Screen
        options={{title: instanceName ?? 'Unknown'}}
        name="LocalTimeline"
        component={LocalTimeline}
      />
      <Drawer.Screen name="ExploreTimeline" component={ExploreTimeline} />
      <Drawer.Screen name="Notifications" component={Notifications} />
      <Drawer.Screen name="Status" component={Status} />
      <Drawer.Screen name="ProfileOverview" component={ProfileNavigator} />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent({navigation}: DrawerContentComponentProps) {
  const [instance, accessToken, setInstance, setAccessToken] = useUserStore(
    s => [s.instance, s.accessToken, s.setInstance, s.setAccessToken],
  );
  return (
    <View style={tw`flex-1`}>
      <>
        <Text style={tw`font-bold text-xl`}>Rattus</Text>
        <Text>A Mastodon client</Text>
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
        {accessToken ? (
          <Pressable
            style={tw`justify-center items-center h-12 bg-gray-200`}
            onPress={() => navigation.navigate('Notifications')}>
            <Text>Notifications</Text>
          </Pressable>
        ) : (
          <Pressable
            style={tw`justify-center items-center h-12 bg-gray-200`}
            onPress={() => navigation.getParent()?.navigate('Instance')}>
            <Text>Connect to instance</Text>
          </Pressable>
        )}
        {accessToken && (
          <Pressable
            style={tw`justify-center items-center h-12 bg-gray-200`}
            onPress={() => {
              setInstance(null);
              setAccessToken(null);
              navigation.navigate('PublicTimeline');
            }}>
            <Text>Log out</Text>
          </Pressable>
        )}
        <DisplayName />
      </>
    </View>
  );
}

function DisplayName() {
  const navigation = useNavigation();
  const [instance] = useUserStore(s => [s.instance]);
  const {data} = useAuthQuery<Account>(
    ['api/v1/accounts/verify_credentials'],
    'api/v1/accounts/verify_credentials',
  );

  if (data == null) {
    return null;
  }

  return (
    <>
      <View style={tw`flex-1`} />
      <Pressable
        onPress={() =>
          navigation.navigate('Root', {
            screen: 'ProfileOverview',
            params: {
              id: data.id,
            },
          })
        }
        style={tw`flex-row items-center pb-2 pl-2`}>
        <Image source={{uri: data?.avatar}} style={tw`w-8 h-8 rounded-lg`} />
        <Text numberOfLines={1} ellipsizeMode="tail">
          <Text style={tw`text-primary-600`}>@{data.username}</Text>
          <Text>@{instance}</Text>
        </Text>
      </Pressable>
    </>
  );
}

export type DrawerNavParamList = {
  PublicTimeline: undefined;
  LocalTimeline: undefined;
  ExploreTimeline: undefined;
  Notifications: undefined;
  Status: {id: string};
  ProfileOverview: {id: string; tab?: PROFILE_TAB};
};

export type RootDrawerScreenProps<Screen extends keyof DrawerNavParamList> =
  CompositeScreenProps<
    DrawerScreenProps<DrawerNavParamList, Screen>,
    NativeStackScreenProps<RootStackParamList, 'Root'>
  >;
