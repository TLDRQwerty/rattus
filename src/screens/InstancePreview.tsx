import React, {useState} from 'react';
import {View} from 'react-native';
import type {RootNavigationStackScreenProps} from '../navigation';
import TextInput from '../ui/TextInput';
import Pressable from '../ui/Pressable';
import Text from '../ui/Text';
import tw from '../tailwind';
import type {Instance} from '../types';
import Image from '../ui/Image';
import Loading from '../ui/Loading';

export default function InstancePreivew({
  navigation,
}: RootNavigationStackScreenProps<'InstancePreview'>): JSX.Element {
  const [url, setUrl] = useState('');
  const [instance, setInstance] = useState<Instance | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInstance = async () => {
    setLoading(true);
    if (url === '') {
      return;
    }

    const response = await fetch(`https://${url}/api/v2/instance`);

    if (response.ok) {
      setInstance((await response.json()) as Instance);
    }
    setLoading(false);
  };

  return (
    <View style={tw`p-4 gap-10`}>
      <View style={tw`flex-row items-center`}>
        <Text>https://</Text>
        <TextInput
          style={tw`flex-1`}
          autoCorrect={false}
          autoFocus
          spellCheck={false}
          enablesReturnKeyAutomatically
          onSubmitEditing={fetchInstance}
          value={url}
          onChangeText={setUrl}
        />
      </View>
      <Pressable
        disabled={url === '' || loading}
        type="button"
        onPress={fetchInstance}>
        <View style={tw`flex-row gap-4`}>
          {loading && <Loading />}
          <Text>Connect to instance</Text>
        </View>
      </Pressable>
      <View>
        {instance && (
          <View style={tw`gap-10`}>
            <View style={tw`m-auto rounded-lg border border-black w-[75%]`}>
              <View style={tw`mx-auto items-center p-2`}>
                <Text style={tw`text-lg font-bold`}>{instance.title}</Text>
                <Image
                  style={tw`w-24 h-24 rounded-full border-black border-4`}
                  source={{uri: instance.thumbnail.url}}
                />
                <Text>{instance.description}</Text>
              </View>
            </View>
            <Pressable
              type="button"
              onPress={() => navigation.navigate('Connect', {uri: url})}>
              <Text>Connect</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
