import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {View, Text} from 'react-native';
import {useDeviceContext} from 'twrnc';
import tw from './tailwind';

export default function App() {
  useDeviceContext(tw);
  return (
    <View>
      <NavigationContainer>
        <Text>Hello World</Text>
      </NavigationContainer>
    </View>
  );
}
