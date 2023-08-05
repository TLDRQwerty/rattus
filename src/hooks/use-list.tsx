import type {ReactNode} from 'react';
import React, {useCallback, useMemo} from 'react';
import type {
  ListRenderItem,
  StyleProp,
  ViewStyle,
  VirtualizedListProps,
} from 'react-native';
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  VirtualizedList,
} from 'react-native';
import {RefreshControl} from 'react-native-gesture-handler';
import tw from '../tailwind';
import useInfiniteQuery from './use-infinite-query';
import Loading from '../ui/Loading';

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
  enabled,
  itemStyle,
  ...rest
}: {
  endpoint: TemplateStringsArray | string;
  data?: RequestInit;
  enabled?: boolean;
  itemStyle?: StyleProp<ViewStyle>;
} & VirtualizedListProps<TType>) {
  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    hasNextPage,
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
    if (status !== 'success' || isFetchingNextPage || !hasNextPage) {
      return;
    }

    void fetchNextPage();
  }, [hasNextPage, fetchNextPage, status, isFetchingNextPage]);

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

    return (
      <View style={StyleSheet.compose(tw`px-4 py-2`, itemStyle)}>
        {renderItem(item)}
      </View>
    );
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
        ListEmptyComponent={
          <View style={tw`items-center mt-4`}>
            <Text>No items found</Text>
          </View>
        }
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
