/* eslint-disable @typescript-eslint/ban-ts-comment */
import { parsePhoneNumber } from 'libphonenumber-js';
import {
  Input,
  InputProps,
} from 'antd';
import { FC } from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { FormPhone } from 'types';

type Props = {
  field: FormPhone,
  disabled?: InputProps['disabled'],
}

const FormTelephoneInput: FC<Props> = ({
  field: {
    formItemProps: {
      name,
      rules,
      label,
    },
    componentProps: { addonAfter },
  },
  disabled,
}) => (
  <FormItem
    name={ name }
    rules={ rules }
    label={ label }
    normalize={ (value: string) => {
      let phone;

      // eslint-disable-next-line no-restricted-globals
      if (!value) {
        return '+1';
      }

      try {
        if (value) {
          const parsedPhone = parsePhoneNumber(value.includes('+') ? value.toString() : `+${value.toString()}`);

          if (parsedPhone.isValid()) {
            phone = parsedPhone.formatInternational();
          } else {
            phone = value;
          }
        }
      } catch {
        phone = value;
      }

      return phone;
    } }
  >
    <Input
      disabled={ disabled }
      placeholder="Phone Number"
      style={ { width: '100%' } }
      addonAfter={ addonAfter }
    />
  </FormItem>
);

export default FormTelephoneInput;
