import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {View, Text, ActivityIndicator} from 'react-native';
import {RootStackScreenProps} from '../navigation';
import {Status} from '../types';

export default function Root({}: RootStackScreenProps<'Root'>) {
  const {data, isLoading, isError} = useQuery<Status[]>(
    ['api/v1/timelines/public'],
    async () => {
      const response = await fetch(
        'https://mastodon.social/api/v1/timelines/public?limit=2',
        {
          method: 'get',
        },
      );
      if (!response.ok) {
        throw new Error('response failed');
      }
      return response.json();
    },
  );
  if (isLoading || data == null) {
    return <ActivityIndicator />;
  }
  return (
    <View>
      {data.map(d => (
        <StatusComponent {...d} />
      ))}
    </View>
  );
}

function StatusComponent({content}: Status) {
  return (
    <View>
      <Text>{content}</Text>
    </View>
  );
}
