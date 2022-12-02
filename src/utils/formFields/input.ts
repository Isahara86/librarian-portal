import { InputProps } from 'antd';
import { getInputField } from './formFieldsUtils';

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
