import React, {useEffect, useRef, useState} from 'react';
import {View, type ListRenderItem} from 'react-native';
import useList from '../hooks/use-list';
import Status from '../Status';
import type {Status as StatusType} from '../types';
import type {RootBottomTabScreenParams} from '../navigation/BottomTab';
import List from '../ui/List';
import * as Icons from '../ui/Icons';
import Text from '../ui/Text';
import tw from '../tailwind';
import Header from '../ui/Header';
import ActionSheet from '../ui/ActionSheet';
import {
  BottomSheetModalProvider,
  type BottomSheetModal,
} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';

const list = [
  {id: 1, name: 'Home', endpoint: 'api/v1/timelines/home', icon: Icons.Home},
  {
    id: 2,
    name: 'Local',
    endpoint: 'api/v1/timelines/public?=local=true',
    icon: Icons.Affiliate,
  },
  {
    id: 3,
    name: 'Federated',
    endpoint: 'api/v1/timelines/public',
    icon: Icons.Planet,
  },
];

export default function Home({
  navigation,
}: RootBottomTabScreenParams<'Home'>): JSX.Element {
  const [selectedList, setSelectedList] = useState(list[0]);
  const {Component} = useList<StatusType>({
    endpoint: selectedList.endpoint,
    renderItem: Item,
  });

  useEffect(() => {
    navigation.setOptions({
      header: props => (
        <Header {...props}>
          <List value={selectedList} onChange={setSelectedList}>
            <List.Button>
              <Header.Text>{selectedList.name}</Header.Text>
            </List.Button>
            <List.Options>
              {list.map(item => (
                <List.Option
                  key={item.id}
                  value={item}
                  disabled={item.id === selectedList.id}>
                  <View style={tw`gap-2 flex-row items-center`}>
                    <item.icon
                      style={tw.style({
                        'text-primary-400': item.id === selectedList.id,
                      })}
                    />
                    <Text size="lg">{item.name}</Text>
                  </View>
                </List.Option>
              ))}
            </List.Options>
          </List>
        </Header>
      ),
    });
  }, [selectedList, navigation]);

  return Component;
}

const Item: ListRenderItem<StatusType> = ({item}): JSX.Element => {
  return <Status {...item} />;
};
