import React from 'react';
import {Text, View} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Profile from '../screens/profile/Profile';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {DrawerNavParamList, RootDrawerScreenProps} from './DrawerNavigator';
import {CompositeScreenProps} from '@react-navigation/native';
import Posts from '../screens/profile/Posts';
import tw from '../tailwind';
import Following from '../screens/profile/Following';
import Followers from '../screens/profile/Followers';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator({
  route,
  navigation,
}: RootDrawerScreenProps<'Profile'>) {
  const {id} = route.params;
  return (
    <View style={tw`px-2 flex-1`}>
      <Profile id={id} />
      <Stack.Navigator
        screenOptions={{
          animation: 'none',
          headerShown: false,
        }}>
        <Stack.Screen name="Posts" component={Posts} />
        <Stack.Screen name="Followers" component={Followers} />
        <Stack.Screen name="Following" component={Following} />
      </Stack.Navigator>
    </View>
  );
}

export type ProfileStackParamList = {
  Posts: {id: string};
  Following: {id: string};
  Followers: {id: string};
};

export type ProfileScreenParams<Screen extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ProfileStackParamList, Screen>,
    DrawerScreenProps<DrawerNavParamList, 'Profile'>
  >;
