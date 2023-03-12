import {CLIENT_ID, CLIENT_SECRET} from '@env';

export async function auth(instance: string, code: string): Promise<Response> {
  const form = new FormData();
  form.append('client_id', CLIENT_ID);
  form.append('client_secret', CLIENT_SECRET);
  form.append('redirect_uri', 'urn:ietf:wg:oauth:2.0:oob');
  form.append('grant_type', 'authorization_code');
  form.append('code', code);
  form.append('scope', 'read write push');

  return await fetch(`https://${instance}/oauth/token`, {
    method: 'POST',
    body: form,
  });
}
