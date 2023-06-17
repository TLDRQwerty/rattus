import React, {useRef} from 'react';
import type {WebViewNavigation} from 'react-native-webview';
import {WebView} from 'react-native-webview';
import {CLIENT_ID, CLIENT_SECRET} from '@env';
import type {RootStackScreenProps} from '../navigation';
import {useUserStore} from '../stores/use-user';
import {auth} from '../api/auth';
//
// https://mastodon.example/oauth/authorize
// ?client_id=CLIENT_ID
// &scope=read+write+push
// &redirect_uri=urn:ietf:wg:oauth:2.0:oob
// &response_type=code

export default function Login({
  route,
  navigation,
}: RootStackScreenProps<'Login'>) {
  const {uri} = route.params;
  const ref = useRef<WebView>(null);
  const [setInstance, setCode, setAccessToken] = useUserStore(state => [
    state.setInstance,
    state.setCode,
    state.setAccessToken,
  ]);
  const handleNavigationStateChange = async (event: WebViewNavigation) => {
    if (event.url.startsWith(`https://${uri}/oauth/authorize/native`)) {
      const parts = event.url.split('code=');
      const code = parts.pop();
      if (code) {
        setInstance(uri);
        setCode(code);

        const response = await auth(uri, code);

        if (response.ok) {
          const json = (await response.json()) as {
            access_token: string;
            created_at: number;
            scope: string;
            token_type: string;
          };
          setAccessToken(json.access_token);
        }
        navigation.navigate('Root', {screen: 'PublicTimeline'});
      }
    }
  };
  return (
    <WebView
      ref={ref}
      originWhitelist={['*']}
      source={{
        uri: `https://${uri}/oauth/authorize?client_id=${CLIENT_ID}&scope=read+write+push&redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=code`,
      }}
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
}
