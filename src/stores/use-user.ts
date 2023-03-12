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
      instance: null,
      setInstance: instance => set({instance}),
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
