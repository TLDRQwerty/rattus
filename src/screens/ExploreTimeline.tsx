import React from 'react';
import type {Status as StatusType} from '../types';
import Status from '../Status';
import type {RootDrawerScreenProps} from '../navigation/DrawerNavigator';
import useList from '../hooks/use-list';

export default function ExploreTimeline({}: RootDrawerScreenProps<'ExploreTimeline'>) {
  const {Component} = useList<StatusType>({
    endpoint: 'api/v1/trends/statuses',
    renderItem: item => <Status {...item.item} />,
  });
  return Component;
}
