import React from 'react';
import type {ListRenderItem} from 'react-native';
import {View} from 'react-native';
import useList from '../hooks/use-list';
import Status from '../Status';
import type {Status as StatusType} from '../types';

export default function Public(): JSX.Element {
  const {Component} = useList<StatusType>({
    endpoint: 'api/v1/timelines/public ',
    renderItem: Item,
  });

  return Component;
}

const Item: ListRenderItem<StatusType> = ({item}): JSX.Element => {
  return <Status {...item} />;
};
