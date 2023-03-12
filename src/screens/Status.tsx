import React, {useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  Text,
  View,
  VirtualizedList,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import useAuthQuery from '../hooks/use-auth-query';
import {RootDrawerScreenProps} from '../navigation/DrawerNavigator';
import tw from '../tailwind';
import {Status as StatusType, Context as ContextType} from '../types';
import StatusComponent from '../Status';
import useInfiniteQuery from '../hooks/use-infinite-query';

function Status({id}: {id: string}) {
  const {data, isLoading, isError} = useAuthQuery<StatusType>(
    ['api/v1/statuses', id],
    `api/v1/statuses/${id}`,
  );

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (data == null || isError) {
    return null;
  }

  return <StatusComponent {...data} />;
}

export default function Context({route}: RootDrawerScreenProps<'Status'>) {
  const {id} = route.params;
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    isFetching,
    refetch,
    isRefetching,
  } = useInfiniteQuery<ContextType>(
    ['api/v1/statuses/context', id],
    `api/v1/statuses/${id}/context`,
  );

  const renderListHeaderComponent = () => {
    return <Status id={id} />;
  };
  if (isLoading || data == null) {
    return <ActivityIndicator />;
  }
  if (isError) {
    return <Text>{String(error)}</Text>;
  }
  return (
    <VirtualizedList<StatusType>
      ListHeaderComponent={renderListHeaderComponent}
      data={data.pages.map(page => page.data.descendants).flat()}
      getItemCount={(d: StatusType[]) => d.length}
      getItem={(d: StatusType[], i) => d[i]}
      renderItem={item => <StatusComponent {...item.item} />}
      ItemSeparatorComponent={Spacer}
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

function Spacer() {
  return <View style={tw`border-gray-900 border-t`} />;
}
