import {
  FormItemProps, InputProps,
} from 'antd';
import {
  DisabledFunc, Override,
} from 'types';
import { getPhoneField } from './formFieldsUtils';

// eslint-disable-next-line import/prefer-default-export
export const phone = ({
  disabled,
  label = 'Phone Number',
  placeholder = 'Enter Number',
  name,
  addonAfter,
}: Override<InputProps, FormItemProps & { disabled?: DisabledFunc | boolean }>) => getPhoneField({
  formItemProps: {
    name: name || 'phone',
    required: true,
    label,
  },
  componentProps: {
    disabled,
    placeholder,
    addonAfter,
  },
});
