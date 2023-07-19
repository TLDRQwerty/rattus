import React, {useState} from 'react';
import RichTextEditor from '../ui/RichTextEditor';

export default function Create(): JSX.Element {
  const [value, setValue] = useState('');

  return (
    <RichTextEditor
      placeholder="Create a status"
      value={value}
      onChangeText={setValue}
    />
  );
}
