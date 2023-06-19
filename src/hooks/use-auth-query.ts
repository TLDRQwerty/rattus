import type {QueryKey, UseQueryOptions} from '@tanstack/react-query';
import {useQuery} from '@tanstack/react-query';
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

  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    queryKey: [...key, instance, accessToken],
    queryFn: async () => {
      if (instance == null) {
        console.error('No instance found');
      }
      if (accessToken == null) {
        console.error('No access token found');
      }

      const response = await fetch(`https://${instance}/${path}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...data?.headers,
        },
        ...data,
      });

      if (!response.ok) {
        console.error(
          `The response returned not ok with status ${response.status}`,
        );
      }

      return response.json();
    },
    ...options,
  });
}
