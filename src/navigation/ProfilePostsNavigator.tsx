import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {CompositeScreenProps} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {ProfileScreenParams, ProfileStackParamList} from './ProfileNavigator';
import Posts from '../screens/profile/Posts';
import PostsAndReplies from '../screens/profile/PostsAndReplies';
import Media from '../screens/profile/Media';
import tw from '../tailwind';

const Stack = createNativeStackNavigator<ProfilePostsStackParamList>();

export default function ProfilePostsNavigator({
  route,
  navigation,
}: ProfileScreenParams<'PostsStack'>) {
  const {id} = route.params;
  return (
    <View style={tw`px-2 flex-1`}>
      <View style={tw`flex-row justify-between`}>
        <Pressable
          onPress={() =>
            navigation.navigate('PostsStack', {
              id,
              screen: 'Posts',
              params: {
                id,
              },
            })
          }>
          <Text>Posts</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            navigation.navigate('PostsStack', {
              id,
              screen: 'PostsAndReplies',
              params: {
                id,
              },
            })
          }>
          <Text>Posts & Replies</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            navigation.navigate('PostsStack', {
              id,
              screen: 'Media',
              params: {
                id,
              },
            })
          }>
          <Text>Media</Text>
        </Pressable>
      </View>
      <Stack.Navigator
        initialRouteName="Posts"
        screenOptions={{
          animation: 'none',
          headerShown: false,
        }}>
        <Stack.Screen name="Posts" component={Posts} />
        <Stack.Screen name="PostsAndReplies" component={PostsAndReplies} />
        <Stack.Screen name="Media" component={Media} />
      </Stack.Navigator>
    </View>
  );
}

export type ProfilePostsStackParamList = {
  Posts: {id: string};
  PostsAndReplies: {id: string};
  Media: {id: string};
};

export type ProfilePostsScreenParams<
  Screen extends keyof ProfilePostsStackParamList,
> = CompositeScreenProps<
  NativeStackScreenProps<ProfilePostsStackParamList, Screen>,
  NativeStackScreenProps<ProfileStackParamList, 'PostsStack'>
>;
