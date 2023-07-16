import React, {useState} from 'react';
import RichTextEditor from '../ui/RichTextEditor';

export default function Create(): JSX.Element {
  const [value, setValue] = useState('');
  return <RichTextEditor value={value} onChangeText={setValue} />;
}
