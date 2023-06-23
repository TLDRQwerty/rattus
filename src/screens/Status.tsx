import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  VirtualizedList,
  View,
} from 'react-native';
import useAuthQuery from '../hooks/use-auth-query';
import type {RootDrawerScreenProps} from '../navigation/DrawerNavigator';
import tw from '../tailwind';
import type {Status as StatusType, Context as ContextType} from '../types';
import Status from '../Status';
import Text from '../ui/Text';

const getItemCount = (arr: unknown[]) => arr.length;
const getItem = (arr: any[], index: number): any => arr[index];
const keyExtractor = (obj: {id: string}) => obj.id;

export default function Context({route}: RootDrawerScreenProps<'Status'>) {
  const {id} = route.params;
  const {data, isLoading, isError, error, refetch, isRefetching} =
    useAuthQuery<ContextType>(
      ['api/v1/statuses/context', id],
      `api/v1/statuses/${id}/context`,
    );

  const renderListHeaderComponent = () => {
    return <FetchedStatus id={id} />;
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
      data={data.descendants}
      getItemCount={getItemCount}
      getItem={getItem}
      renderItem={item => <Status {...item.item} />}
      keyExtractor={keyExtractor}
      contentContainerStyle={tw`gap-4`}
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

function FetchedStatus({id}: {id: string}) {
  const {data, status, error} = useAuthQuery<StatusType>(
    ['api/v1/statuses', id],
    `api/v1/statuses/${id}`,
  );

  if (status === 'loading') {
    return <ActivityIndicator />;
  }

  if (status === 'error') {
    return <Text>{String(error)}</Text>;
  }

  return (
    <View style={tw`border-b border-gray-400`}>
      <Status {...data} />
    </View>
  );
}
