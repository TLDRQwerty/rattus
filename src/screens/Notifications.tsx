import React from 'react';
import {ListRenderItem, Text, View} from 'react-native';
import {Notification} from '../types';
import Status from '../Status';
import useVirtualizedList from '../hooks/use-virtualized-list';

export default function Notifications() {
  const renderItem: ListRenderItem<Notification> = ({item}) => {
    return (
      <View>
        <Text>{item.type}</Text>
        {item.status != null ? <Status {...item.status} /> : null}
      </View>
    );
  };

  const {Component} = useVirtualizedList<Notification>({
    endpoint: 'api/v1/notifications',
    renderItem: renderItem,
  });

  return Component;
}
