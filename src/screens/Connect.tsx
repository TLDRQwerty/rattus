import React, {useRef} from 'react';
import type {RootNavigationStackScreenProps} from '../navigation';
import type {WebViewNavigation} from 'react-native-webview';
import WebView from 'react-native-webview';
import {useUserStore} from '../stores/use-user';
import {auth} from '../api/auth';

const {EXPO_PUBLIC_CLIENT_ID} = process.env;

export default function LoggingIn({
  navigation,
  route,
}: RootNavigationStackScreenProps<'Connect'>): JSX.Element {
  const ref = useRef<WebView>(null);
  const [setInstance, setCode, setAccessToken] = useUserStore(state => [
    state.setInstance,
    state.setCode,
    state.setAccessToken,
  ]);

  const handleNavigationStateChange = async (event: WebViewNavigation) => {
    if (
      event.url.startsWith(`https://${route.params.uri}/oauth/authorize/native`)
    ) {
      const parts = event.url.split('code=');
      const code = parts.pop();
      if (code) {
        setInstance(route.params.uri);
        setCode(code);

        const response = await auth(route.params.uri, code);

        if (response.ok) {
          const json = (await response.json()) as {
            access_token: string;
            created_at: number;
            scope: string;
            token_type: string;
          };
          setAccessToken(json.access_token);
        }
        navigation.navigate('RootBottomTab', {screen: 'Home'});
      }
    }
  };
  return (
    <WebView
      ef={ref}
      originWhitelist={['*']}
      source={{
        uri: `https://${route.params.uri}/oauth/authorize?client_id=${EXPO_PUBLIC_CLIENT_ID}&scope=read+write+push&redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=code`,
      }}
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
}
