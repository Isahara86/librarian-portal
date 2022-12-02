import { getCheckboxField } from './formFieldsUtils';

// eslint-disable-next-line import/prefer-default-export
export const rememberMe = getCheckboxField({
  componentProps: { children: 'Remember Me' },
  formItemProps: { name: 'rememberMe' },
});
