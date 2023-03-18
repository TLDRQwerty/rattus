import React from 'react';
import {VirtualizedList, ActivityIndicator, RefreshControl} from 'react-native';
import useInfiniteQuery from '../../hooks/use-infinite-query';
import useList from '../../hooks/use-list';
import {ProfilePostsScreenParams} from '../../navigation/ProfilePostsNavigator';
import Status from '../../Status';
import tw from '../../tailwind';
import {Status as StatusType} from '../../types';

export default function Posts({route}: ProfilePostsScreenParams<'Posts'>) {
  const {id} = route.params;
  const {Component} = useList<StatusType>({
    endpoint: `api/v1/accounts/${id}/statuses`,
    renderItem: item => <Status {...item.item} />,
  });
  return Component;
}
