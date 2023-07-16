import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import Home from '../screens/Home';
import Me from '../screens/Me';
import Search from '../screens/Search';
import * as Icons from '../ui/Icons';
import tw from '../tailwind';
import Create from '../screens/Create';
import Notifications from '../screens/Notifications';
import {useUserStore} from '../stores/use-user';

const Tab = createBottomTabNavigator<RootBottomTabParamList>();

function renderIcon(icon: (props: Icons.Props) => React.JSX.Element) {
  return ({focused}: {focused: boolean; color: string; size: number}) => {
    return icon({
      strokeWidth: 3,
      style: tw.style({'text-primary-400': focused}),
    });
  };
}

export default function BottomTabNavigator(): JSX.Element {
  const accessToken = useUserStore(s => s.accessToken);
  return (
    <Tab.Navigator
      screenOptions={{tabBarShowLabel: false, tabBarHideOnKeyboard: true}}>
      <Tab.Screen
        options={{tabBarIcon: renderIcon(Icons.Home)}}
        name="Home"
        component={Home}
      />
      <Tab.Screen
        options={{tabBarIcon: renderIcon(Icons.Search)}}
        name="Search"
        component={Search}
      />
      {accessToken && (
        <Tab.Screen
          options={{tabBarIcon: renderIcon(Icons.SquarePlus)}}
          name="Create"
          component={Create}
        />
      )}
      {accessToken && (
        <Tab.Screen
          options={{tabBarIcon: renderIcon(Icons.Notification)}}
          name="Notifications"
          component={Notifications}
        />
      )}
      <Tab.Screen
        options={{tabBarIcon: renderIcon(Icons.Profile)}}
        name="Me"
        component={Me}
      />
    </Tab.Navigator>
  );
}

export type RootBottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Create: undefined;
  Notifications: undefined;
  Me: undefined;
};

export type RootBottomTabScreenParams<
  Screen extends keyof RootBottomTabParamList,
> = BottomTabScreenProps<RootBottomTabParamList, Screen>;
