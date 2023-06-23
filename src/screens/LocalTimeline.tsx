import React from 'react';
import type {Status as StatusType} from '../types';
import Status from '../Status';
import type {RootDrawerScreenProps} from '../navigation/DrawerNavigator';
import useList from '../hooks/use-list';

export default function LocalTimeline({}: RootDrawerScreenProps<'LocalTimeline'>) {
  const {Component} = useList<StatusType>({
    endpoint: 'api/v1/timelines/public?local=true',
    renderItem: item => <Status {...item.item} />,
  });

  return Component;
}
