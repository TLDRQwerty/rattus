import React from 'react';
import {View, Text, useWindowDimensions} from 'react-native';
import RenderHTML from 'react-native-render-html';
import tw from '../../tailwind';
import type {Account} from '../../types';
import Image from '../../ui/Image';

interface Props {
  profile: Account;
}

export default function Profile({profile}: Props) {
  const {width} = useWindowDimensions();
  return (
    <View>
      <View style={tw`w-full h-32 relative`}>
        <View style={tw`absolute w-full`}>
          <Image source={{uri: profile.header}} style={tw`w-full h-24`} />
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
                <RenderHTML contentWidth={width} source={{html: field.value}} />
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}
