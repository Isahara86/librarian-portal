import React from 'react';
import {
  Form,
  DatePicker,
} from 'antd';
import { FormDatePicker } from 'types';

const { Item } = Form;

interface Props {
  field: FormDatePicker,
  disabled: boolean,
}

const FormDatePicker: React.FC<Props> = ({
  field: {
    formItemProps: {
      name,
      rules,
      label,
      normalize,
      noStyle,
    },
    componentProps: {
      defaultPickerValue,
      placeholder,
      disabledDate,
    },
  },
  disabled,
}) => (
  <Item
    name={ name }
    rules={ rules }
    label={ label }
    normalize={ normalize }
    noStyle={ noStyle }
  >
    <DatePicker
      defaultPickerValue={ defaultPickerValue }
      style={ { width: '100%' } }
      format="dddd MM/DD/YYYY"
      getPopupContainer={ node => node.parentNode as HTMLElement }
      placeholder={ placeholder }
      disabled={ disabled }
      disabledDate={ disabledDate }
    />
  </Item>
);

export default FormDatePicker;
