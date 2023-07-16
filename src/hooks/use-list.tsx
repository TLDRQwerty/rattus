import type {ReactNode} from 'react';
import React, {useCallback, useMemo} from 'react';
import type {ListRenderItem, VirtualizedListProps} from 'react-native';
import {ActivityIndicator, Text, View, VirtualizedList} from 'react-native';
import {RefreshControl} from 'react-native-gesture-handler';
import tw from '../tailwind';
import useInfiniteQuery from './use-infinite-query';
import Loading from '../ui/Loading';

const getItemCount = (arr: unknown[]) => arr.length;
const getItem = (arr: any[], index: number): any => arr[index];
const keyExtractor = (obj: {id: string}) => obj.id;

const ItemSeparatorComponent = () => (
  <View style={tw`border-b border-gray-800`} />
);
const CellRendererComponent = ({children}: {children: ReactNode}) => (
  <View>{children}</View>
);

export default function useList<TType extends {id: string}>({
  endpoint,
  renderItem,
  ListFooterComponent,
  enabled,
  ...rest
}: {
  endpoint: TemplateStringsArray | string;
  data?: RequestInit;
  enabled?: boolean;
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
    {},
    {
      enabled,
    },
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

  const renderItemWrapper: ListRenderItem<TType> = item => {
    if (!renderItem) {
      return <View />;
    }

    return <View style={tw`px-4 py-2`}>{renderItem(item)}</View>;
  };

  let Component = null;
  if (status === 'loading' && data == null) {
    Component = <Loading />;
  }
  if (status === 'error') {
    Component = <Text>{String(error)}</Text>;
  }

  if (data != null) {
    Component = (
      <VirtualizedList<TType>
        data={flatData}
        renderItem={renderItemWrapper}
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

  if (!Component) {
    Component = <Loading />;
  }

  return {
    Component,
  };
}
