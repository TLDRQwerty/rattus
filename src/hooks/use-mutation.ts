import type {UseMutationOptions} from '@tanstack/react-query';
import {useMutation as useBaseMutation} from '@tanstack/react-query';
import {useUserStore} from '../stores/use-user';

export default function useMutation() {
  const [instance, accessToken] = useUserStore(s => [
    s.instance,
    s.accessToken,
  ]);

  return useBaseMutation();
}
