import React, {useEffect, useRef, useState} from 'react';
import type {TextInputProps} from 'react-native';
import {View, TextInput, Platform, PermissionsAndroid} from 'react-native';
import {Camera as CameraIcon, Photo} from './Icons';
import Pressable from './Pressable';
import * as ImagePicker from 'expo-image-picker';
import Image from './Image';
import tw from '../tailwind';
import type {RefHandle} from './Alert';
import Alert from './Alert';
import Text from './Text';
import Modal from './Modal';
import Camera from './Camera';
import type {PhotoFile} from 'react-native-vision-camera';
import {ScrollView} from 'react-native-gesture-handler';
import Filmstirp from './Filmstirp';

type Props = TextInputProps;

export default function RichTextEditor({...rest}: Props): JSX.Element {
  const [attachments, setAttachments] = useState<
    ImagePicker.ImagePickerAsset[]
  >([]);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const alertRef = useRef<RefHandle>();

  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [showCamera, setShowCamera] = useState(false);

  const [selectedAttachemnt, setSelectedAttachment] =
    useState<null | ImagePicker.ImagePickerAsset>(null);

  const addPhoto = async () => {
    if (!status?.granted) {
      await requestPermission();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        allowsMultipleSelection: true,
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

  const onPhotoTaken = async (photo: PhotoFile) => {
    setPhotos(p => p.concat(photo));
  };

  return (
    <>
      <View>
        <TextInput multiline {...rest} />
        <Filmstirp data={attachments}>
          {attachment => (
            <Filmstirp.Item id={attachment.uri}>
              <Image
                style={tw`w-24 h-24 rounded`}
                source={{uri: attachment.uri}}
                key={attachment.uri}
                disableModal
              />
            </Filmstirp.Item>
          )}
        </Filmstirp>
        <ScrollView horizontal>
          {photos.map(photo => (
            <Image
              style={tw`w-24 h-24`}
              source={{uri: `file://${photo.path}`}}
              key={photo.path}
            />
          ))}
        </ScrollView>
        <View style={tw`flex-row gap-2`}>
          <Pressable onPress={addPhoto}>
            <Photo />
          </Pressable>
          <Pressable onPress={() => setShowCamera(true)}>
            <CameraIcon />
          </Pressable>
          <Pressable onPress={test}>
            <Text>Test</Text>
          </Pressable>
        </View>
        <Alert ref={alertRef}>
          <Text style={tw`text-lg`}>Delete Attachment?</Text>
          {selectedAttachemnt && (
            <Image
              style={tw`w-24 h-24`}
              source={{uri: selectedAttachemnt.uri}}
            />
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
      <Modal
        visible={showCamera}
        onDismiss={() => setShowCamera(false)}
        onRequestClose={() => setShowCamera(false)}
        onShow={() => setShowCamera(true)}>
        <Camera onPhotoTaken={onPhotoTaken} />
      </Modal>
    </>
  );
}
