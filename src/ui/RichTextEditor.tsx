import React, {useEffect, useRef, useState} from 'react';
import type {TextInputProps} from 'react-native';
import {View, TextInput} from 'react-native';
import {Photo} from './Icons';
import Pressable from './Pressable';
import * as ImagePicker from 'expo-image-picker';
import Image from './Image';
import tw from '../tailwind';
import type {RefHandle} from './Alert';
import Alert from './Alert';
import Text from './Text';

type Props = TextInputProps;

export default function RichTextEditor({...rest}: Props): JSX.Element {
  const [attachments, setAttachments] = useState<
    ImagePicker.ImagePickerAsset[]
  >([]);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const alertRef = useRef<RefHandle>();

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

  const test = () => {
    alertRef.current?.show();
  };

  return (
    <View>
      <TextInput multiline {...rest} />
      <View style={tw`flex-row`}>
        {attachments.map(attachment => (
          <Image
            style={tw`w-24 h-24`}
            source={{uri: attachment.uri}}
            key={attachment.assetId}
          />
        ))}
      </View>
      <Pressable onPress={addPhoto}>
        <Photo />
      </Pressable>
      <Pressable onPress={test}>
        <Text>Test</Text>
      </Pressable>
      <Alert ref={alertRef}>
        <View>
          <Text>This is some content</Text>
          <Pressable onPress={() => alertRef.current?.hide()}>
            <Text>Close</Text>
          </Pressable>
        </View>
      </Alert>
    </View>
  );
}
