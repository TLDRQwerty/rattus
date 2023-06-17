import React from 'react';
import type {ListRenderItem} from 'react-native';
import {Text, View} from 'react-native';
import type {Notification} from '../types';
import Status from '../Status';
import useList from '../hooks/use-list';

export default function Notifications() {
  const renderItem: ListRenderItem<Notification> = ({item}) => {
    switch (item.type) {
      case 'follow':
        return (
          <View>
            <Text>{item.type}</Text>
            <Text>{item.account.display_name}</Text>
          </View>
        );
      case 'mention':
        return (
          <View>
            <Text>{item.type}</Text>
            {item.status != null ? <Status {...item.status} /> : null}
          </View>
        );
      default:
        return (
          <View>
            <Text>{item.type}</Text>
          </View>
        );
    }
  };

  const {Component} = useList<Notification>({
    endpoint: 'api/v1/notifications',
    renderItem: renderItem,
  });

  return Component;
}
