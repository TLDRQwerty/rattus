import React, {useState} from 'react';
import RichTextEditor from '../ui/RichTextEditor';
import { RootBottomTabScreenParams } from '../navigation/BottomTab';

export default function Create({
  route,
}: RootBottomTabScreenParams<'Create'>): JSX.Element {
  const {params} = route;
  console.log({params});
  const [value, setValue] = useState('');

  return (
    <RichTextEditor
      placeholder="Create a status"
      value={value}
      onChangeText={setValue}
    />
  );
}
