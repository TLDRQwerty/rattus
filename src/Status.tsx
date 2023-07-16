import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, useWindowDimensions} from 'react-native';
import RenderHTML from 'react-native-render-html';
import tw from './tailwind';
import type {Status as StatusType} from './types';
import {VISIBILITY} from './types';
import Account from './ui/Account';
import {Heart, MessageCircle, Repeat} from './ui/Icons';
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
        <Status {...reblog} />
      </View>
    );
  }
  return (
    <Pressable
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
        <View>
          {visibility !== VISIBILITY.PUBLIC && (
            <Text style={tw`capitalize text-gray-400`}>{visibility}</Text>
          )}
        </View>
      </View>
      <RenderHTML contentWidth={width} source={{html: content}} />
      {media_attachments?.length !== 0
        ? media_attachments?.map(attachment => (
            <View key={attachment.id}>
              <Image
                style={tw`w-full h-42`}
                resizeMode="contain"
                source={{uri: attachment.preview_url}}
              />
              <Text>{attachment.description}</Text>
            </View>
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
