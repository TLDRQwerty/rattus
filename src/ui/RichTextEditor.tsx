import React, {useState} from 'react';
import type {TextInputProps} from 'react-native';
import {View, TextInput} from 'react-native';
import {Photo} from './Icons';
import Pressable from './Pressable';
import * as ImagePicker from 'expo-image-picker';
import Image from './Image';
import tw from '../tailwind';

type Props = TextInputProps;

export default function RichTextEditor({...rest}: Props): JSX.Element {
  const [attachments, setAttachments] = useState<
    ImagePicker.ImagePickerAsset[]
  >([]);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  const addPhoto = async () => {
    if (!status?.granted) {
      await requestPermission();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setAttachments(p => p.concat(...result.assets));
      }
    }
  };

  return (
    <View>
      <TextInput {...rest} />
      <View style={tw`flex-row`}>
        {attachments.map(attachment => (
          <Image
            style={tw`w-24 h-24`}
            key={attachment.assetId}
            source={{uri: attachment.uri}}
          />
        ))}
      </View>
      <Pressable onPress={addPhoto}>
        <Photo />
      </Pressable>
    </View>
  );
}
