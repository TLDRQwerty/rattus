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
  ...rest
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

  const flatData = useMemo(
    () => data?.pages.map(page => page.data).flat(),
    [data?.pages],
  );

  const onEndReached = useCallback(() => {
    if (isLoading || isFetching || fetchNextPage == null) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, isFetching, isLoading]);

  const onRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const renderListFooterComponent = useCallback(() => {
    if (isLoading || isFetching) {
      return <ActivityIndicator />;
    }
    return null;
  }, [isLoading, isFetching]);

  let Component = null;
  if (isLoading && data == null) {
    Component = <ActivityIndicator />;
  }
  if (isError) {
    Component = <Text>{String(error)}</Text>;
  }

  if (data != null && !isLoading) {
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
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListFooterComponent={renderListFooterComponent}
        CellRendererComponent={CellRendererComponent}
        {...rest}
      />
    );
  }

  return {
    Component,
  };
}
