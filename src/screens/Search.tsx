import React, {useState} from 'react';
import {View} from 'react-native';
import useDebounce from '../hooks/use-debounce';
import useList from '../hooks/use-list';
import Text from '../ui/Text';
import {Search as SearchIcon} from '../ui/Icons';
import Status from '../Status';
import TextInput from '../ui/TextInput';
import tw from '../tailwind';
import Tabs from '../ui/Tabs';
import {useQuery} from '@tanstack/react-query';
import {useUserStore} from '../stores/use-user';
import type {Search as SearchType} from '../types';
import Loading from '../ui/Loading';
import Account from '../ui/Account';

export default function Search(): JSX.Element {
  const [accessToken, instance] = useUserStore(s => [
    s.accessToken,
    s.instance,
  ]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const {data, isLoading} = useQuery({
    queryKey: ['/api/v2/search', debouncedSearch],
    queryFn: async (): Promise<SearchType> => {
      if (instance == null) {
        throw Error('No instance found');
      }
      if (accessToken == null) {
        throw Error('No access token found');
      }

      const headers = new Headers();
      headers.set('Authorization', `Bearer ${accessToken}`);

      const response = await fetch(
        `https://${instance}/api/v2/search?q=${debouncedSearch}`,
        {
          headers,
        },
      );

      if (!response.ok) {
        throw Error(
          `The response returned not ok with status ${response.status}`,
        );
      }

      return response.json();
    },
    enabled: debouncedSearch !== '',
  });

  return (
    <View>
      <View style={tw`flex-row items-center`}>
        <SearchIcon />
        <TextInput style={tw`flex-1`} value={search} onChangeText={setSearch} />
      </View>
      <Tabs>
        <Tabs.Tab title={<Text>Accounts</Text>}>
          <>
            {debouncedSearch != null && isLoading && <Loading />}
            {data?.accounts?.map(account => (
              <Account
                id={account.id}
                username={account.username}
                fullUsername={account.acct}
                avatarUri={account.avatar_static}
              />
            ))}
          </>
        </Tabs.Tab>
        <Tabs.Tab title={<Text>Statuses</Text>}>
          <>
            {debouncedSearch != null && isLoading && <Loading />}
            {data?.statuses?.map(status => (
              <Status {...status} />
            ))}
          </>
        </Tabs.Tab>
        <Tabs.Tab title={<Text>Hashtags</Text>}>
          <>
            {debouncedSearch != null && isLoading && <Loading />}
            {data?.hashtags?.map(tag => (
              <Text>{tag.name}</Text>
            ))}
          </>
        </Tabs.Tab>
      </Tabs>
    </View>
  );
}
