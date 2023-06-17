import React from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {DrawerNavParamList} from './DrawerNavigator';
import DrawerNavigator from './DrawerNavigator';
import type {NavigatorScreenParams} from '@react-navigation/native';
import Instance from '../screens/Instance';
import InstancePreivew from '../screens/modals/InstancePreview';
import Login from '../screens/Login';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigatior() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Root" component={DrawerNavigator} />
      <Stack.Screen name="Instance" component={Instance} />
      <Stack.Group screenOptions={{presentation: 'modal'}}>
        <Stack.Screen name="InstancePreivew" component={InstancePreivew} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<DrawerNavParamList>;
  Instance: undefined;
  InstancePreivew: {uri: string};
  Login: {uri: string};
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

// This declaration is used by useNavigation, Link, ref etc.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamList {}
  }
}
