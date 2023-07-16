import React, {useState} from 'react';
import type {ListRenderItem} from 'react-native';
import {View} from 'react-native';
import useDebounce from '../hooks/use-debounce';
import Text from '../ui/Text';
import {Search as SearchIcon} from '../ui/Icons';
import Status from '../Status';
import TextInput from '../ui/TextInput';
import tw from '../tailwind';
import Tabs from '../ui/Tabs';
import {useQuery} from '@tanstack/react-query';
import {useUserStore} from '../stores/use-user';
import type {
  Search as SearchType,
  Tag,
  Status as StatusType,
  Account as AccountType,
} from '../types';
import Loading from '../ui/Loading';
import Account from '../ui/Account';
import {FlatList} from 'react-native-gesture-handler';

const getItemCount = (arr: unknown[]) => arr.length;
const getItem = (arr: any[], index: number): any => arr[index];
const keyExtractor = (obj: {id: string}) => obj.id;

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

      return response.json() as Promise<SearchType>;
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
            <FlatList
              data={data?.accounts}
              renderItem={AccountItem}
              ListEmptyComponent={
                <View>
                  {debouncedSearch != null && isLoading && <Loading />}
                  <Text>No results found</Text>
                </View>
              }
            />
          </>
        </Tabs.Tab>
        <Tabs.Tab title={<Text>Statuses</Text>}>
          <>
            <FlatList
              data={data?.statuses}
              renderItem={StatusItem}
              ListEmptyComponent={
                <View>
                  {debouncedSearch != null && isLoading && <Loading />}
                  <Text>No results found</Text>
                </View>
              }
            />
          </>
        </Tabs.Tab>
        <Tabs.Tab title={<Text>Hashtags</Text>}>
          <>
            <FlatList
              data={data?.hashtags}
              renderItem={HashTagItem}
              ListEmptyComponent={
                <View>
                  {debouncedSearch != null && isLoading && <Loading />}
                  <Text>No results found</Text>
                </View>
              }
            />
          </>
        </Tabs.Tab>
      </Tabs>
    </View>
  );
}

const AccountItem: ListRenderItem<AccountType> = ({item}) => {
  return (
    <Account
      id={item.id}
      username={item.username}
      fullUsername={item.acct}
      avatarUri={item.avatar_static}
    />
  );
};

const StatusItem: ListRenderItem<StatusType> = ({item}) => {
  return <Status {...item} />;
};

const HashTagItem: ListRenderItem<Tag> = ({item}) => {
  const uses = item.history[item.history.length - 1].uses?.length;
  const accounts = item.history[item.history.length - 1].accounts.length;
  return (
    <View>
      <Text>#{item.name}</Text>
      <View style={tw`flex-row`}>
        {accounts > 0 && <Text subtext>Accounts {accounts}</Text>}
        {uses > 0 && <Text subtext>Uses {uses}</Text>}
      </View>
    </View>
  );
};
