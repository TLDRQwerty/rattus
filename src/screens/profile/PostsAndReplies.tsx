import React from 'react';
import {VirtualizedList, ActivityIndicator, RefreshControl} from 'react-native';
import useInfiniteQuery from '../../hooks/use-infinite-query';
import {ProfilePostsScreenParams} from '../../navigation/ProfilePostsNavigator';
import Status from '../../Status';
import tw from '../../tailwind';
import {Status as StatusType} from '../../types';

export default function Posts({route}: ProfilePostsScreenParams<'Posts'>) {
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
    ['api/v1/accounts/statuses?exclude_replies=false', id],
    `api/v1/accounts/${id}/statuses?exclude_replies=false`,
  );
  if (data == null || isError) {
    return null;
  }
  if (isLoading) {
    return <ActivityIndicator />;
  }
  const flatData = data.pages.map(page => page.data).flat();
  return (
    <VirtualizedList
      data={flatData}
      getItemCount={(d: StatusType[]) => d.length}
      getItem={(d: StatusType[], i) => d[i]}
      renderItem={item => <Status {...item.item} />}
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
