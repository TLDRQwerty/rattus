import {CommonActions, useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  View,
  Image,
  Text,
  useWindowDimensions,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import useAuthQuery from '../../hooks/use-auth-query';
import {ProfileScreenParams} from '../../navigation/ProfileNavigatior';
import tw from '../../tailwind';
import {Account} from '../../types';
import Pressable from '../../ui/Pressable';

export default function Profile({id}: {id: string}) {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const {data, isLoading, isError} = useAuthQuery<Account>(
    ['api/v1/accounts', id],
    `api/v1/accounts/${id}`,
  );
  if (isError || data == null) {
    return null;
  }
  if (isLoading) {
    return <ActivityIndicator />;
  }
  return (
    <View>
      <View style={tw`w-full h-32 relative`}>
        <View style={tw`absolute w-full`}>
          <Image source={{uri: data.header}} style={tw`w-full h-24`} />
        </View>
        <View style={tw`absolute bottom-0 left-[5%]`}>
          <Image
            source={{uri: data.avatar}}
            style={tw`w-16 h-16 rounded-2xl`}
          />
        </View>
      </View>

      <View style={tw`mt-2`}>
        <Text style={tw`text-primary-600 font-bold text-lg`}>
          {data.display_name !== '' ? data.display_name : data.username}
        </Text>
        <Text style={tw`text-gray-400`}>{data.acct}</Text>
      </View>

      <View>
        <RenderHTML
          source={{html: data.note}}
          contentWidth={width}
          enableExperimentalMarginCollapsing={true}
        />
      </View>

      {data.fields.length !== 0 ? (
        <View>
          {data.fields.map(field => (
            <View key={field.name} style={tw`flex-row gap-4`}>
              <Text style={tw`capitalize`}>{field.name}</Text>
              <RenderHTML contentWidth={width} source={{html: field.value}} />
            </View>
          ))}
        </View>
      ) : null}

      <View style={tw`flex-row gap-4`}>
        <Pressable
          onPress={() =>
            navigation.dispatch(
              CommonActions.navigate({name: 'Posts', params: {id}}),
            )
          }>
          <Text>{data.statuses_count} Posts</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            navigation.dispatch(
              CommonActions.navigate({name: 'Following', params: {id}}),
            )
          }>
          <Text>{data.following_count} Following</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            navigation.dispatch(
              CommonActions.navigate({name: 'Followers', params: {id}}),
            )
          }>
          <Text>{data.followers_count} Followers</Text>
        </Pressable>
      </View>
    </View>
  );
}
