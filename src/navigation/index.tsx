import React from 'react';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import Root from '../screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigatior() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={Root} />
    </Stack.Navigator>
  );
}

type RootStackParamList = {
  Root: undefined;
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
