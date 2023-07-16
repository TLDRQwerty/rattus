import React from 'react';
import {View, useWindowDimensions} from 'react-native';
import type {Account, Status as StatusType} from './types';
import tw from './tailwind';
import Image from './ui/Image';
import Text from './ui/Text';
import RenderHTML from 'react-native-render-html';
import useList from './hooks/use-list';
import Status from './Status';

export default function ProfileInner({profile}: {profile: Account}) {
  const {width} = useWindowDimensions();
  const {Component} = useList<StatusType>({
    endpoint: `/api/v1/accounts/${profile.id}/statuses`,
    renderItem: ({item}) => <Status {...item} />,
    ListHeaderComponent: (
      <View>
        <View style={tw`w-full h-32 relative`}>
          <View style={tw`absolute w-full`}>
            {profile.header && (
              <Image source={{uri: profile.header}} style={tw`w-full h-24`} />
            )}
          </View>
          <View style={tw`absolute bottom-0 left-[5%]`}>
            <Image
              source={{uri: profile.avatar}}
              style={tw`w-16 h-16 rounded-2xl`}
            />
          </View>
        </View>

        <View style={tw`px-2`}>
          <View style={tw`mt-2`}>
            <Text style={tw`text-primary-600 font-bold text-lg`}>
              {profile.display_name !== ''
                ? profile.display_name
                : profile.username}
            </Text>
            <Text style={tw`text-gray-400`}>{profile.acct}</Text>
          </View>

          <View>
            <RenderHTML
              source={{html: profile.note}}
              contentWidth={width}
              enableExperimentalMarginCollapsing={true}
            />
          </View>

          {profile.fields.length !== 0 ? (
            <View>
              {profile.fields.map(field => (
                <View key={field.name} style={tw`flex-row gap-4`}>
                  <Text style={tw`capitalize`}>{field.name}</Text>
                  <RenderHTML
                    contentWidth={width}
                    source={{html: field.value}}
                  />
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    ),
  });
  return Component;
}
