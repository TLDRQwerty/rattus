import React from 'react';
import type {ListRenderItem} from 'react-native';
import {View} from 'react-native';
import type {RootBottomTabScreenParams} from '../navigation/BottomTab';
import useList from '../hooks/use-list';
import Text from '../ui/Text';
import type {Notification} from '../types';
import Status from '../Status';
import Account from '../ui/Account';
import tw from '../tailwind';

const notificationTypeToComponent: Record<
  Notification['type'],
  (something: Notification) => JSX.Element
> = {
  status: args => <Status {...args.status!} />,
  follow: args => (
    <View style={tw`flex-row gap-10`}>
      <Account
        id={args.account.id}
        username={args.account.username}
        fullUsername={args.account.acct}
        avatarUri={args.account.avatar_static}
      />
      <Text>followed you</Text>
    </View>
  ),
  poll: args => <Text>TODO</Text>,
  reblog: args => <Status {...args.status!} />,
  update: args => <Text>TODO</Text>,
  mention: args => <Status {...args.status!} />,
  favourite: args => <Status {...args.status!} />,
  'admin.report': args => <Text>TODO</Text>,
  follow_request: args => <Text>TODO</Text>,
  'admin.sign_up': args => <Text>TODO</Text>,
};

export default function Notifications({}: RootBottomTabScreenParams<'Notifications'>): JSX.Element {
  const {Component} = useList<Notification>({
    endpoint: '/api/v1/notifications',
    renderItem: Item,
  });

  return Component;
}

const Item: ListRenderItem<Notification> = ({item}): JSX.Element => {
  const children = notificationTypeToComponent[item.type];
  return <View>{children(item)}</View>;
};
