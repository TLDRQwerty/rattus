import React from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootBottomTabParamList} from './BottomTab';
import BottomTabNavigator from './BottomTab';
import Profile from '../screens/Profile';
import Status from '../screens/Status';
import type {NavigatorScreenParams} from '@react-navigation/native';
import InstancePreivew from '../screens/InstancePreview';
import Connect from '../screens/Connect';
import FollowingAndFollowers from '../screens/FollowingAndFollowers';
import Camera from '../screens/Camera';
import Settings from '../screens/Settings';
import Header from '../ui/Header';
import FavoritedAndBoosted from '../screens/FavoritedAndBoosted';
import Lists, {ListItem} from '../screens/Lists';

const Stack = createNativeStackNavigator<RootNavigationStackParamList>();

export default function RootNavigation(): JSX.Element {
  return (
    <Stack.Navigator screenOptions={{header: Header}}>
      <Stack.Screen
        options={{headerShown: false}}
        name="RootBottomTab"
        component={BottomTabNavigator}
      />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Status" component={Status} />
      <Stack.Screen
        options={{presentation: 'modal', headerTitle: 'Log in'}}
        name="InstancePreview"
        component={InstancePreivew}
      />
      <Stack.Screen name="Connect" component={Connect} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Lists" component={Lists} />
      <Stack.Group
        screenOptions={{
          presentation: 'transparentModal',
          headerShown: false,
        }}>
        <Stack.Screen
          name="FollowingAndFollowers"
          component={FollowingAndFollowers}
        />
        <Stack.Screen name="Camera" component={Camera} />
        <Stack.Screen
          name="FavoritedAndBoosted"
          component={FavoritedAndBoosted}
        />
        <Stack.Screen name="ListItem" component={ListItem} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export type RootNavigationStackParamList = {
  RootBottomTab: NavigatorScreenParams<RootBottomTabParamList>;
  Profile: {id: string};
  Status: {id: string};
  InstancePreview: undefined;
  Connect: {uri: string};
  FollowingAndFollowers: {id: string};
  Camera: undefined;
  Settings: undefined;
  FavoritedAndBoosted: {id: string};
  Lists: undefined;
  ListItem: {id: string};
};

export type RootNavigationStackScreenProps<
  Screen extends keyof RootNavigationStackParamList,
> = NativeStackScreenProps<RootNavigationStackParamList, Screen>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootNavigationStackParamList {}
  }
}
