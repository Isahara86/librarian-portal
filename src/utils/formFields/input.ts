import { InputProps } from 'antd';
import {
  getInputField, getPasswordField,
} from './formFieldsUtils';

// eslint-disable-next-line import/prefer-default-export
export const otp = ({ disabled }: InputProps) => getInputField({
  componentProps: {
    placeholder: 'Otp',
    disabled,
  },
  formItemProps: {
    name: 'otp',
    required: true,
  },
});

export const login = getInputField({
  componentProps: { placeholder: 'Login' },
  formItemProps: {
    name: 'login',
    required: true,
  },
});

export const password = getPasswordField({ placeholder: 'Password' });
