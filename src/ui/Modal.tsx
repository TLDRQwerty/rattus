import React from 'react';
import type {ModalProps} from 'react-native';
import {Modal as BaseModal} from 'react-native';

type Props = ModalProps;

export default function Modal({...props}: Props): JSX.Element {
  return <BaseModal {...props} />;
}
