import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

const TIMELINES = {
  LOCAL: 'LOCAL',
  PUBLIC: 'PUBLIC',
  EXPLORE: 'EXPLORE',
} as const;
type TIMELINES = (typeof TIMELINES)[keyof typeof TIMELINES];

interface Store {
  lastTimeline: TIMELINES;
}

export const usePreferenceStore = create<Store>()(
  persist(set => ({}), {
    name: 'preference',
    storage: createJSONStorage(() => AsyncStorage),
  }),
);
