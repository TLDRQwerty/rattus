import React from 'react';
import {Pressable} from 'react-native';
import {Status as StatusType} from '../types';
import {useNavigation} from '@react-navigation/native';
import Status from '../Status';
import {RootDrawerScreenProps} from '../navigation/DrawerNavigator';
import useVirtualizedList from '../hooks/use-virtualized-list';

export default function LocalTimeline({}: RootDrawerScreenProps<'LocalTimeline'>) {
  const {Component} = useVirtualizedList<StatusType>({
    endpoint: 'api/v1/timelines/public?local=true',
    renderItem: item => <StatusComponent {...item.item} />,
  });

  return Component;
}

function StatusComponent({...props}: StatusType) {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Root', {screen: 'Status', params: {id: props.id}});
      }}>
      <Status {...props} />
    </Pressable>
  );
}
