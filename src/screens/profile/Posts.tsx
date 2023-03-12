import React from 'react';
import {
  View,
  Text,
  VirtualizedList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import useInfiniteQuery from '../../hooks/use-infinite-query';
import {ProfileScreenParams} from '../../navigation/ProfileNavigatior';
import Status from '../../Status';
import tw from '../../tailwind';
import {Status as StatusType} from '../../types';

export default function Posts({route}: ProfileScreenParams<'Posts'>) {
  return null
  const {id} = route.params;
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetching,
    refetch,
    isRefetching,
  } = useInfiniteQuery<StatusType>(
    ['api/v1/accounts/statuses', id],
    `api/v1/accounts/${id}/statuses`,
  );
  if (data == null || isError) {
    return null;
  }
  if (isLoading) {
    return <ActivityIndicator />;
  }
  const flatData = data.pages.map(page => page.data).flat();
  return (
    <View>
      <View style={tw`flex-row justify-between`}>
        <Text>Posts</Text>
        <Text>Posts & Replies</Text>
        <Text>Media</Text>
      </View>

      <VirtualizedList
        data={flatData}
        getItemCount={(d: StatusType[]) => d.length}
        getItem={(d: StatusType[], i) => d[i]}
        renderItem={item => <Status {...item.item} />}
        contentContainerStyle={tw`gap-2`}
        onEndReached={
          fetchNextPage != null && !isFetching
            ? () => fetchNextPage()
            : undefined
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
    </View>
  );
}
