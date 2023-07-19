import {useEffect, useState} from 'react';
import type {EventSubscription, KeyboardEvent} from 'react-native';
import {Keyboard} from 'react-native';
export default function useKeyboard() {
  const [keyboard, setKeyboard] = useState<KeyboardEvent | null>();

  useEffect(() => {
    const emitters: EventSubscription[] = [];

    emitters.push(Keyboard.addListener('keyboardDidShow', setKeyboard));
    emitters.push(Keyboard.addListener('keyboardDidHide', setKeyboard));
    return () => {
      emitters.forEach(emitter => emitter.remove());
    };
  }, []);

  return keyboard;
}
