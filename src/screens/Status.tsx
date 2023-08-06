import React from 'react';
import type {ListRenderItem} from 'react-native';
import {View, VirtualizedList} from 'react-native';
import type {RootNavigationStackScreenProps} from '../navigation';
import useAuthQuery from '../hooks/use-auth-query';
import Loading from '../ui/Loading';
import Text from '../ui/Text';
import type {Context as ContextType, Status as StatusType} from '../types';
import StatusComponent from '../Status/Status';
import tw from '../tailwind';
import {RefreshControl} from 'react-native-gesture-handler';

const getItemCount = (arr: unknown[]) => arr.length;
const getItem = (arr: any[], index: number): any => arr[index];
const keyExtractor = (obj: {id: string}) => obj.id;

export default function Status({
  route,
}: RootNavigationStackScreenProps<'Status'>): JSX.Element {
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
    return <Loading />;
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
      renderItem={StatusItem}
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

const StatusItem: ListRenderItem<StatusType> = ({item}) => (
  <View style={tw`px-4 py-2`}>
    <StatusComponent {...item} />
  </View>
);

function FetchedStatus({id}: {id: string}) {
  const {data, status, error} = useAuthQuery<StatusType>(
    ['api/v1/statuses', id],
    `api/v1/statuses/${id}`,
  );

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'error') {
    return <Text>{String(error)}</Text>;
  }

  return (
    <View style={tw`border-b border-gray-400 px-4 py-2`}>
      <StatusComponent {...data} />
    </View>
  );
}
