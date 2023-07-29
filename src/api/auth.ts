const {EXPO_PUBLIC_CLIENT_ID, EXPO_PUBLIC_SECRET} = process.env;

export async function auth(instance: string, code: string): Promise<Response> {
  const form = new FormData();
  form.append('client_id', EXPO_PUBLIC_CLIENT_ID);
  form.append('client_secret', EXPO_PUBLIC_SECRET);
  form.append('redirect_uri', 'urn:ietf:wg:oauth:2.0:oob');
  form.append('grant_type', 'authorization_code');
  form.append('code', code);
  form.append('scope', 'read write push');

  return await fetch(`https://${instance}/oauth/token`, {
    method: 'POST',
    body: form,
  });
}
