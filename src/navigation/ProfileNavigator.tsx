import React from 'react';
import {View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Profile from '../screens/profile/Profile';
import type {DrawerScreenProps} from '@react-navigation/drawer';
import type {
  DrawerNavParamList,
  RootDrawerScreenProps,
} from './DrawerNavigator';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import tw from '../tailwind';
import Following from '../screens/profile/Following';
import Followers from '../screens/profile/Followers';
import type {ProfilePostsStackParamList} from './ProfilePostsNavigator';
import ProfilePostsNavigator from './ProfilePostsNavigator';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator({
  route,
}: RootDrawerScreenProps<'ProfileOverview'>) {
  const {id} = route.params;
  return (
    <View style={tw`px-2 flex-1`}>
      <Profile id={id} />
      <Stack.Navigator
        initialRouteName="PostsStack"
        screenOptions={{
          animation: 'none',
          headerShown: false,
        }}>
        <Stack.Screen name="PostsStack" component={ProfilePostsNavigator} />
        <Stack.Screen name="Followers" component={Followers} />
        <Stack.Screen name="Following" component={Following} />
      </Stack.Navigator>
    </View>
  );
}

export type ProfileStackParamList = {
  PostsStack: NavigatorScreenParams<ProfilePostsStackParamList> & {id: string};
  Following: {id: string};
  Followers: {id: string};
};

export type ProfileScreenParams<Screen extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ProfileStackParamList, Screen>,
    DrawerScreenProps<DrawerNavParamList, 'ProfileOverview'>
  >;
