import React, {useEffect, useRef, useState} from 'react';
import type {TextInputProps} from 'react-native';
import {View, TextInput} from 'react-native';
import {Camera, Photo} from './Icons';
import Pressable from './Pressable';
import * as ImagePicker from 'expo-image-picker';
import Image from './Image';
import tw from '../tailwind';
import type {RefHandle} from './Alert';
import Alert from './Alert';
import Text from './Text';
import {useNavigation} from '@react-navigation/native';
import useKeyboard from '../hooks/use-keyboard';

type Props = TextInputProps;

export default function RichTextEditor({...rest}: Props): JSX.Element {
  const navigation = useNavigation();
  const [attachments, setAttachments] = useState<
    ImagePicker.ImagePickerAsset[]
  >([]);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const alertRef = useRef<RefHandle>();

  const [selectedAttachemnt, setSelectedAttachment] =
    useState<null | ImagePicker.ImagePickerAsset>(null);

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
          <Pressable
            onLongPress={() => {
              console.log('did this work');
              if (alertRef.current) {
                setSelectedAttachment(attachment);
                alertRef.current.show();
              }
            }}>
            <Image
              style={tw`w-24 h-24`}
              source={{uri: attachment.uri}}
              key={attachment.assetId}
            />
          </Pressable>
        ))}
      </View>
      <View style={tw`flex-row gap-2`}>
        <Pressable onPress={addPhoto}>
          <Photo />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Camera')}>
          <Camera />
        </Pressable>
        <Pressable onPress={test}>
          <Text>Test</Text>
        </Pressable>
      </View>
      <Alert ref={alertRef}>
        <Text style={tw`text-lg`}>Delete Attachment?</Text>
        {selectedAttachemnt && (
          <Image style={tw`w-24 h-24`} source={{uri: selectedAttachemnt.uri}} />
        )}
        <View style={tw`flex-row justify-end gap-8 mt-auto`}>
          <Pressable onPress={alertRef.current?.hide}>
            <Text>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              alertRef.current?.hide();
            }}>
            <Text>Delete</Text>
          </Pressable>
        </View>
      </Alert>
    </View>
  );
}
