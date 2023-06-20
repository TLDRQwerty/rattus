import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

interface Store {
  instance: string | null;
  setInstance: (instance: string | null) => void;
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  code: string | null;
  setCode: (code: string | null) => void;
}

export const useUserStore = create<Store>()(
  persist(
    set => ({
      instance: 'mastodon.social',
      setInstance: instance =>
        instance == null ? set({instance: 'mastodon.social'}) : set({instance}),
      accessToken: null,
      setAccessToken: accessToken => set({accessToken}),
      code: null,
      setCode: code => set({code}),
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
