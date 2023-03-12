import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import { CLIENT_SECRET, CLIENT_ID } from '@env';
import { RootStackScreenProps } from '../../navigation';
import { Instance as InstanceType } from '../../types';
import tw from '../../tailwind';
import Pressable from '../../ui/Pressable';
import WebView from 'react-native-webview';

export default function InstancePreivew({
  route,
  navigation,
}: RootStackScreenProps<'InstancePreivew'>) {
  const { uri } = route.params;
  const { data, isError, isLoading } = useQuery<InstanceType>(
    ['/api/v2/instance', uri],
    async () => {
      const response = await fetch(`https://${uri}/api/v2/instance`);
      if (!response.ok) {
        throw Error('An unknown error occured');
      }
      return response.json();
    },
  );
  if (data == null || isError) {
    return null;
  }
  if (isLoading) {
    return <ActivityIndicator />;
  }
  return (
    <View style={tw`mt-16`}>
      <View style={tw`m-auto rounded-lg border border-black w-[75%]`}>
        <View style={tw`mx-auto items-center p-2`}>
          <Text style={tw`text-lg font-bold`}>{data.title}</Text>
          <Image
            style={tw`w-24 h-24 rounded-full border-black border-4`}
            source={{ uri: data.thumbnail.url }}
          />
          <Text>{data.description}</Text>
        </View>
      </View>
      <Pressable
        type="button"
        onPress={() => navigation.navigate('Login', { uri })}>
        <Text>Connect</Text>
      </Pressable>
    </View>
  );
}
