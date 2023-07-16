import React, {useState} from 'react';
import {View} from 'react-native';
import useDebounce from '../hooks/use-debounce';
import useList from '../hooks/use-list';
import Text from '../ui/Text';
import {Search as SearchIcon} from '../ui/Icons';
import TextInput from '../ui/TextInput';
import tw from '../tailwind';

export default function Search(): JSX.Element {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const {Component} = useList<never>({
    endpoint: `api/v2/search?q=${debouncedSearch}`,
    renderItem: ({item}) => <Text>{JSON.stringify(item)}</Text>,
    enabled: debouncedSearch !== '',
  });

  return (
    <View>
      <View style={tw`flex-row items-center`}>
        <SearchIcon />
        <TextInput style={tw`flex-1`} value={search} onChangeText={setSearch} />
      </View>
      {Component}
    </View>
  );
}
