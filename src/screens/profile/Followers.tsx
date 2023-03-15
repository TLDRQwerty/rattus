import {CommonActions, useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  Text,
  View,
  VirtualizedList,
} from 'react-native';
import useInfiniteQuery from '../../hooks/use-infinite-query';
import {ProfileScreenParams} from '../../navigation/ProfileNavigator';
import tw from '../../tailwind';
import {Account as AccountType} from '../../types';
import Pressable from '../../ui/Pressable';

export default function Followers({route}: ProfileScreenParams<'Followers'>) {
  const {id} = route.params;
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetching,
    refetch,
    isRefetching,
  } = useInfiniteQuery<AccountType[]>(
    ['api/v1/accounts/followers', id],
    `api/v1/accounts/${id}/followers`,
  );
  if (data == null || isError) {
    return null;
  }
  if (isLoading) {
    return <ActivityIndicator />;
  }
  const flatData = data.pages.map(page => page.data).flat();
  return (
    <VirtualizedList<AccountType>
      data={flatData}
      getItemCount={(d: AccountType[]) => d.length}
      getItem={(d: AccountType[], i) => d[i]}
      renderItem={item => <Account {...item.item} />}
      contentContainerStyle={tw`gap-2`}
      onEndReached={
        fetchNextPage != null && !isFetching ? () => fetchNextPage() : undefined
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => {
            void refetch();
          }}
        />
      }
      onEndReachedThreshold={0.3}
    />
  );
}

function Account({avatar, username, url, id}: AccountType) {
  const navigation = useNavigation();
  return (
    <Pressable
      style={tw`flex-row gap-2`}
      onPress={() =>
        navigation.dispatch(
          CommonActions.navigate({name: 'ProfileOverview', params: {id}}),
        )
      }>
      <Image source={{uri: avatar}} style={tw`rounded-lg w-8`} />
      <View>
        <Text>{username}</Text>
        <Text>{url}</Text>
      </View>
    </Pressable>
  );
}
