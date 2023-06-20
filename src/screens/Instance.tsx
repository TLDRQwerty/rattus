import {useMutation} from '@tanstack/react-query';
import React, {useState} from 'react';
import {View, Text, Image} from 'react-native';
import type {RootStackScreenProps} from '../navigation';
import {useUserStore} from '../stores/use-user';
import tw from '../tailwind';
import {Instance as InstanceType} from '../types';
import Pressable from '../ui/Pressable';
import TextInput from '../ui/TextInput';

export default function Instance({
  navigation,
}: RootStackScreenProps<'Instance'>) {
  const [uri, setUri] = useState(useUserStore(s => s.instance ?? ''));
  const {mutate} = useMutation(
    (value: string) => {
      return fetch(`https://${value}/api/v2/instance`);
    },
    {
      onSuccess: data => {
        if (data.ok) {
          navigation.navigate('InstancePreivew', {uri});
        }
      },
    },
  );
  return (
    <View style={tw`w-screen h-screen`}>
      <View style={tw`my-auto px-4 gap-8`}>
        <View style={tw`flex-row items-center`}>
          <Text>https://</Text>
          <TextInput
            style={tw`flex-row flex-1`}
            value={uri}
            onChangeText={setUri}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <Pressable type="button" onPress={() => mutate(uri)}>
          <Text>Preview Instance</Text>
        </Pressable>
      </View>
    </View>
  );
}
