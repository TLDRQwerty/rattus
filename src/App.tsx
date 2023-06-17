import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import React, {useEffect} from 'react';
import type {AppStateStatus} from 'react-native';
import {AppState, Platform} from 'react-native';
import {useDeviceContext} from 'twrnc';
import tw from './tailwind';
import Navigator from './navigation';
import {
  QueryClient,
  QueryClientProvider,
  onlineManager,
  focusManager,
} from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useFlipper} from '@react-navigation/devtools';

const queryClient = new QueryClient();

if (__DEV__) {
  void import('react-query-native-devtools').then(({addPlugin}) => {
    addPlugin({queryClient});
  });
}

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(!!state.isConnected);
  });
});

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const config = {};

const linking = {
  prefixes: ['rattus://'],
  config,
};

export default function App() {
  const navigationRef = useNavigationContainerRef();

  useDeviceContext(tw);
  useFlipper(navigationRef);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);
  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer linking={linking} ref={navigationRef}>
          <Navigator />
        </NavigationContainer>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
