import React from 'react';
import {
  ActivityIndicator,
  ListRenderItem,
  RefreshControl,
  Text,
  View,
  VirtualizedList,
  VirtualizedListProps,
} from 'react-native';
import tw from '../tailwind';
import useInfiniteQuery from './use-infinite-query';

function Spacer() {
  return <View style={tw`border-gray-900 border-t`} />;
}

export default function useVirtualizedList<TType>({
  endpoint,
  renderItem,
}: {
  endpoint: TemplateStringsArray | string;
} & VirtualizedListProps<TType>) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    isFetching,
    refetch,
    isRefetching,
  } = useInfiniteQuery<TType[]>(
    Array.isArray(endpoint) ? endpoint : [endpoint],
    typeof endpoint === 'string' ? endpoint : endpoint.join(),
  );

  let Component = null;
  if (isLoading || data == null) {
    Component = <ActivityIndicator />;
  }
  if (isError) {
    Component = <Text>{String(error)}</Text>;
  }

  if (data != null && !isLoading) {
    const flatData = data.pages.map(page => page.data).flat()
    Component = (
      <VirtualizedList<TType>
        data={flatData}
        getItemCount={(d: TType[]) => d.length}
        getItem={(d: TType[], i) => d[i]}
        renderItem={renderItem}
        ItemSeparatorComponent={Spacer}
        onEndReached={
          fetchNextPage != null && !isFetching
            ? () => fetchNextPage()
            : undefined
        }
        contentContainerStyle={tw`gap-2`}
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

  return {
    Component,
  };
}
