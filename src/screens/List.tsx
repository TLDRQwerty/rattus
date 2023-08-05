import React from 'react';
import {View} from 'react-native';
import useList from '../hooks/use-list';
import type {List as ListType} from '../types';
import Text from '../ui/Text';

export default function List(): JSX.Element {
  const {Component} = useList<ListType>({
    renderItem: ({item}) => (
      <View>
        <Text>{item.title}</Text>
      </View>
    ),
    endpoint: 'api/v1/lists',
  });

  return Component;
}
