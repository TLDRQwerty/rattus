import type {ReactNode} from 'react';
import React, {useCallback, useMemo} from 'react';
import type {VirtualizedListProps} from 'react-native';
import {ActivityIndicator, Text, View, VirtualizedList} from 'react-native';
import {RefreshControl} from 'react-native-gesture-handler';
import tw from '../tailwind';
import useInfiniteQuery from './use-infinite-query';

const getItemCount = (arr: unknown[]) => arr.length;
const getItem = (arr: any[], index: number): any => arr[index];
const keyExtractor = (obj: {id: string}) => obj.id;

const ItemSeparatorComponent = () => (
  <View style={tw`border-b border-gray-200`} />
);
const CellRendererComponent = ({children}: {children: ReactNode}) => (
  <View>{children}</View>
);

export default function useList<TType extends {id: string}>({
  endpoint,
  renderItem,
  ListFooterComponent,
  ...rest
}: {
  endpoint: TemplateStringsArray | string;
} & VirtualizedListProps<TType>) {
  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery<TType[]>(
    Array.isArray(endpoint) ? endpoint : [endpoint],
    typeof endpoint === 'string' ? endpoint : endpoint.join(),
  );

  const flatData = useMemo(() => data?.pages.flatMap(d => d.data), [data]);

  const onEndReached = useCallback(() => {
    if (status !== 'success' || isFetchingNextPage || fetchNextPage == null) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, status, isFetchingNextPage]);

  const onRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const renderListFooterComponent = useCallback(() => {
    if (isFetchingNextPage) {
      return <ActivityIndicator />;
    }
    return null;
  }, [isFetchingNextPage]);

  let Component = null;
  if (status === 'loading' && data == null) {
    Component = <ActivityIndicator />;
  }
  if (status === 'error') {
    Component = <Text>{String(error)}</Text>;
  }

  if (data != null) {
    Component = (
      <VirtualizedList<TType>
        data={flatData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemCount={getItemCount}
        getItem={getItem}
        initialNumToRender={4}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
        onEndReached={onEndReached}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListFooterComponent={renderListFooterComponent ?? ListFooterComponent}
        CellRendererComponent={CellRendererComponent}
        {...rest}
      />
    );
  }

  return {
    Component,
  };
}
