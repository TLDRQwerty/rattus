import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, useWindowDimensions} from 'react-native';
import RenderHTML from 'react-native-render-html';
import tw from './tailwind';
import type {Status as StatusType} from './types';
import {VISIBILITY} from './types';
import Account from './ui/Account';
import {CornerDownRight, Heart, MessageCircle, Repeat} from './ui/Icons';
import Image from './ui/Image';
import Pressable from './ui/Pressable';
import Text from './ui/Text';

type Props = StatusType;

export default function Status({
  id,
  content,
  reblogs_count,
  reblogged,
  reblog,
  replies_count,
  favourites_count,
  account,
  media_attachments,
  favourited,
  visibility,
}: Props) {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  if (reblog) {
    return (
      <View>
        <Account
          id={account.id}
          username={account.username}
          fullUsername={account.acct}
          avatarUri={account.avatar_static}
        />
        <View style={tw`flex-row`}>
          <CornerDownRight style={tw`text-primary-400`} />
          <Status {...reblog} />
        </View>
      </View>
    );
  }
  return (
    <Pressable
      style={tw`px-2`}
      onPress={() =>
        navigation.navigate('Status', {
          id,
        })
      }>
      <View style={tw`w-full justify-between h-8`}>
        <Account
          id={account.id}
          username={account.username}
          fullUsername={account.acct}
          avatarUri={account.avatar_static}
        />
      </View>
      <View>
        {visibility !== VISIBILITY.PUBLIC && (
          <Text subtext style={tw`capitalize`}>
            {visibility}
          </Text>
        )}
      </View>
      <RenderHTML contentWidth={width} source={{html: content}} />
      {media_attachments?.length !== 0
        ? media_attachments?.map(attachment => (
            <Image
              key={attachment.id}
              style={tw`w-full h-42`}
              resizeMode="contain"
              source={{uri: attachment.preview_url}}>
              <View style={tw`bg-gray-200 rounded p-4`}>
                <Text subtext>{attachment.description}</Text>
              </View>
            </Image>
          ))
        : null}
      <View style={tw`flex-row justify-between`}>
        <View style={tw`flex-row items-center`}>
          <MessageCircle />
          <Text>{replies_count}</Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <Repeat style={tw.style(reblogged && 'text-primary-600')} />
          <Text>{reblogs_count}</Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <Heart style={tw.style(favourited && 'text-primary-600')} />
          <Text>{favourites_count}</Text>
        </View>
      </View>
    </Pressable>
  );
}
