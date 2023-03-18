import React from 'react';
import {Pressable} from 'react-native';
import {Status as StatusType} from '../types';
import {useNavigation} from '@react-navigation/native';
import Status from '../Status';
import {RootDrawerScreenProps} from '../navigation/DrawerNavigator';
import useList from '../hooks/use-list';

export default function PublicTimeline({}: RootDrawerScreenProps<'PublicTimeline'>) {
  const {Component} = useList<StatusType>({
    endpoint: 'api/v1/timelines/public',
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
