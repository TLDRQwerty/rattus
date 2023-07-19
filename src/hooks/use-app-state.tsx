import {useEffect, useState} from 'react';
import type {AppStateStatus} from 'react-native';
import {AppState} from 'react-native';

export function useAppState() {
  const [appState, setAppState] = useState<AppStateStatus | null>(null);

  useEffect(() => {
    const onChange = (state: AppStateStatus): void => {
      setAppState(state);
    };
    const listener = AppState.addEventListener('change', onChange);
    return () => listener.remove();
  }, [setAppState]);

  return appState;
}
