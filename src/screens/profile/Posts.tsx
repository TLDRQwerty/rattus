import React from 'react';
import useList from '../../hooks/use-list';
import type {ProfilePostsScreenParams} from '../../navigation/ProfilePostsNavigator';
import Status from '../../Status';
import type {Status as StatusType} from '../../types';

export default function Posts({route}: ProfilePostsScreenParams<'Posts'>) {
  const {id} = route.params;
  const {Component} = useList<StatusType>({
    endpoint: `api/v1/accounts/${id}/statuses`,
    renderItem: item => <Status {...item.item} />,
  });
  return Component;
}
