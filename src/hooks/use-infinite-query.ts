import {
  QueryKey,
  useInfiniteQuery as useInfiniteQueryBase,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import {useUserStore} from '../stores/use-user';

interface LinkHeader {
  url: string;
  rel: string;
  [key: string]: string; // allow for any other custom parameters
}

function parseLinkHeader(header: string): LinkHeader[] {
  const links: LinkHeader[] = [];

  if (!header) {
    return links;
  }

  const parts = header.split(',');
  for (const part of parts) {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (!match) {
      continue;
    }

    const url = match[1];
    const rel = match[2];

    const link: LinkHeader = {url, rel};

    // parse any additional parameters
    const params = part.substr(match[0].length).split(';');
    for (const param of params) {
      const [key, value] = param.trim().split('=');
      if (key && value) {
        link[key] = value.replace(/"/g, '');
      }
    }

    links.push(link);
  }

  return links;
}

export default function useInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  key: TQueryKey,
  path: string,
  data?: RequestInit,
  options?: Omit<
    UseInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey
    >,
    'queryKey' | 'queryFn'
  >,
): UseInfiniteQueryResult<{data: TData; headers: Headers}, TError> {
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

  return useInfiniteQueryBase(
    [...key, instance, accessToken],
    async ({pageParam}) => {
      const url = pageParam == null ? `https://${instance}/${path}` : pageParam;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...data?.headers,
        },
        ...data,
      });

      if (!response.ok) {
        throw Error(response.statusText);
      }

      const linkHeaders = response.headers.get('link');

      let nextPage = null;
      let prevPage = null;
      if (linkHeaders != null) {
        const parsedLinkHeaders = parseLinkHeader(linkHeaders);
        nextPage = parsedLinkHeaders.find(a => a.rel === 'next')?.url;
        prevPage = parsedLinkHeaders.find(a => a.rel === 'prev')?.url;
      }

      return {
        data: await response.json(),
        nextPage,
        prevPage,
      };
    },
    {
      ...options,
      getNextPageParam: lastPage => {
        return lastPage?.nextPage;
      },
    },
  );
}
