import React from 'react';
import useInfiniteQuery from '../hooks/use-infinite-query';
import {
  ActivityIndicator,
  ListRenderItem,
  RefreshControl,
  VirtualizedList,
  Text,
  View,
} from 'react-native';
import tw from '../tailwind';
import {Notification} from '../types';
import Status from '../Status';

export default function Notifications() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    isFetching,
    refetch,
    isRefetching,
  } = useInfiniteQuery<Notification[]>(
    ['api/v1/notifications'],
    'api/v1/notifications',
  );

  const renderItem: ListRenderItem<Notification> = ({item}) => {
    return (
      <View>
        <Text>{item.type}</Text>
        {item.status != null ? <Status {...item.status} /> : null}
      </View>
    );
  };

  if (data == null || isError) {
    return null;
  }
  if (isLoading) {
    return <ActivityIndicator />;
  }
  const flatData = data.pages.map(page => page.data).flat();

  return (
    <VirtualizedList<Notification>
      data={flatData}
      getItemCount={(d: Notification[]) => d.length}
      getItem={(d: Notification[], i) => d[i]}
      renderItem={renderItem}
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
