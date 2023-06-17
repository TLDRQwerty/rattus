import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  VirtualizedList,
  Pressable,
  RefreshControl,
} from 'react-native';
import type {Status as StatusType} from '../types';
import tw from '../tailwind';
import {useNavigation} from '@react-navigation/native';
import Status from '../Status';
import type {RootDrawerScreenProps} from '../navigation/DrawerNavigator';
import useInfiniteQuery from '../hooks/use-infinite-query';

export default function PublicTimeline({}: RootDrawerScreenProps<'ExploreTimeline'>) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    isFetching,
    refetch,
    isRefetching,
  } = useInfiniteQuery<StatusType[]>(
    ['api/v1/trends/statuses'],
    'api/v1/trends/statuses',
  );

  if (isLoading || data == null) {
    return <ActivityIndicator />;
  }
  if (isError) {
    return <Text>{String(error)}</Text>;
  }
  return (
    <VirtualizedList<StatusType>
      data={data.pages.map(page => page.data).flat()}
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

function StatusComponent({...props}: StatusType) {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Root', {screen: 'Status', params: {id: props.id}});
      }}>
      <Status {...props} />
    </Pressable>
  );
}
