import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  Image,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import tw from './tailwind';
import {Status as StatusType} from './types';
import {Heart, MessageCircle, Repeat} from './ui/Icons';

interface Props extends StatusType {}

export default function Status({
  content,
  reblogs_count,
  replies_count,
  favourites_count,
  account,
  media_attachments,
  favourited,
}: Props) {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  return (
    <View style={tw`px-2 py-4`}>
      <Pressable
        style={tw`flex-row flex-1 gap-2 items-center`}
        onPress={() =>
          navigation.navigate('Root', {
            screen: 'ProfileOverview',
            params: {
              screen: 'PostsStack',
              id: account.id,
              params: {
                id: account.id,
                screen: 'Posts',
                params: {
                  id: account.id,
                },
              },
            },
          })
        }>
        <View>
          <Image
            source={{uri: account.avatar_static}}
            style={tw`w-8 h-8 rounded-full`}
          />
        </View>
        <Text>{account.username}</Text>
        <Text>{account.acct}</Text>
      </Pressable>
      <RenderHTML contentWidth={width} source={{html: content}} />
      {media_attachments?.length !== 0
        ? media_attachments?.map(attachment => (
            <View key={attachment.id}>
              <Text>{attachment.description}</Text>
              <Image
                style={tw`w-full h-48`}
                resizeMode="contain"
                source={{uri: attachment.preview_url}}
              />
            </View>
          ))
        : null}
      <View style={tw`flex-row justify-between`}>
        <View style={tw`flex-row items-center`}>
          <MessageCircle />
          <Text>{replies_count}</Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <Repeat />
          <Text>{reblogs_count}</Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <Heart
            style={tw.style(favourited && 'bg-violet-200 text-violet-600')}
          />
          <Text>{favourites_count}</Text>
        </View>
      </View>
    </View>
  );
}
