import {QueryKey, useQuery, UseQueryOptions} from '@tanstack/react-query';
import {useUserStore} from '../stores/use-user';
export default function useAuthQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  key: TQueryKey,
  path: string,
  data?: RequestInit,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'queryFn' | 'initialData'
  > & {
    initialData?: () => undefined;
  },
) {
  const [instance, accessToken] = useUserStore(s => [
    s.instance,
    s.accessToken,
  ]);
  if (instance == null) {
    throw Error('No instance found');
  }
  if (accessToken == null) {
    throw Error('No access token found');
  }
  return useQuery<TQueryFnData, TError, TData, TQueryKey>(
    [...key, instance, accessToken],
    async () => {
      const response = await fetch(`https://${instance}/${path}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...data?.headers,
        },
        ...data,
      });

      if (!response.ok) {
        throw Error(response.statusText);
      }

      return response.json();
    },
    options,
  );
}
