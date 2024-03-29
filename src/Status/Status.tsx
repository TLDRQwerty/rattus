import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import type {LayoutChangeEvent} from 'react-native';
import {View, useWindowDimensions, Share} from 'react-native';
import tw from '../tailwind';
import type {Status as StatusType} from '../types';
import {VISIBILITY} from '../types';
import Account from '../ui/Account';
import {CornerDownRight, Heart, MessageCircle, Repeat} from '../ui/Icons';
import Image from '../ui/Image';
import Pressable from '../ui/Pressable';
import Text from '../ui/Text';
import ActionSheet from '../ui/ActionSheet';
import type {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useMutation} from '@tanstack/react-query';
import {useUserStore} from '../stores/use-user';
import {useSnackBar} from '../ui/SnackBar';
import {queryClient} from '../App';
import type {PaginatedResponse} from '../hooks/use-infinite-query';
import {updateItem} from '../utils/query';
import RenderHTML from '../ui/RenderHTML';

interface Props extends StatusType {
  onLongPress?: () => void | Promise<void>;
  queryKey: string[];
}

export default function Status({
  queryKey,
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
  url,
}: Props) {
  const navigation = useNavigation();
  const actionSheetRef = useRef<BottomSheetModal>(null);
  const [width, setWidth] = useState(useWindowDimensions().width);
  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const {showSnack} = useSnackBar();

  const [instance, accessToken] = useUserStore(s => [
    s.instance,
    s.accessToken,
  ]);
  const headers: Headers = new Headers();
  headers.set('Authorization', `Bearer ${accessToken}`);
  const {mutate: mutateFavourite} = useMutation({
    mutationKey: [id, 'api/v1/statuses/:id/favourite', instance, accessToken],
    mutationFn: async () => {
      const response = await fetch(
        `https://${instance}/api/v1/statuses/${id}/${
          favourited ? 'unfavourite' : 'favourite'
        }`,
        {
          method: 'POST',
          headers,
        },
      );
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(response.statusText);
      }
    },
    onSuccess: (status: StatusType) => {
      showSnack?.(
        <Text style={tw`text-white`}>
          Post {favourited ? 'Unfavourited' : 'Favourited'}
        </Text>,
      );

      queryClient.setQueryData<PaginatedResponse<StatusType>>(
        queryKey,
        oldData => updateItem(oldData, status),
      );
    },
  });

  const {mutate: mutateReblog} = useMutation({
    mutationKey: [id, 'api/v1/statuses/:id/reblog', instance, accessToken],
    mutationFn: async () => {
      const response = await fetch(
        `https://${instance}/api/v1/statuses/${id}/${
          reblog ? 'unreblog' : 'reblog'
        }`,
        {
          method: 'POST',
          headers,
        },
      );
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(response.statusText);
      }
    },
    onSuccess: (status: StatusType) => {
      showSnack?.(
        <Text style={tw`text-white`}>
          Post {reblog ? 'Unblogged' : 'Reblogged'}
        </Text>,
      );

      queryClient.setQueryData<PaginatedResponse<StatusType>>(
        queryKey,
        oldData => updateItem(oldData, status),
      );
    },
  });

  const onShare = async () => {
    const result = await Share.share({
      url,
    });
  };
  if (reblog) {
    return (
      <View>
        <Account
          id={account.id}
          username={account.username}
          fullUsername={account.acct}
          avatarUri={account.avatar_static}
        />
        <View style={tw`flex-row pr-6`}>
          <CornerDownRight style={tw`text-primary-400`} />
          <View onLayout={onLayout} style={tw`w-full`}>
            <Status {...reblog} />
          </View>
        </View>
      </View>
    );
  }
  return (
    <>
      <Pressable
        style={tw`px-2 w-full`}
        onPress={() =>
          navigation.navigate('Status', {
            id,
          })
        }
        onLongPress={() => {
          if (actionSheetRef.current) {
            actionSheetRef.current.present();
          }
        }}>
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
        <View onLayout={onLayout}>
          <RenderHTML contentWidth={width} source={{html: content}} />
        </View>
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
          <Pressable onPress={mutateReblog} style={tw`flex-row items-center`}>
            <Repeat style={tw.style(reblogged && 'text-primary-600')} />
            <Text>{reblogs_count}</Text>
          </Pressable>
          <Pressable
            style={tw`flex-row items-center`}
            onPress={mutateFavourite}>
            <Heart style={tw.style(favourited && 'text-primary-600')} />
            <Text>{favourites_count}</Text>
          </Pressable>
        </View>
      </Pressable>
      <ActionSheet ref={actionSheetRef}>
        <ActionSheet.Item
          onPress={() => {
            navigation.navigate('FavoritedAndBoosted', {id});
          }}>
          <Text>Show who favorited and boosted</Text>
        </ActionSheet.Item>
        <ActionSheet.Item onPress={onShare}>
          <Text>Share</Text>
        </ActionSheet.Item>
      </ActionSheet>
    </>
  );
}
