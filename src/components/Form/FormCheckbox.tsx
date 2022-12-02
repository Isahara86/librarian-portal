import React from 'react';
import {
  Form,
  Checkbox,
} from 'antd';
import { FormCheckbox } from 'types';

const { Item } = Form;

interface Props {
  field: FormCheckbox,
  disabled: boolean
}

const FormCheckbox: React.FC<Props> = ({
  field: {
    formItemProps: {
      name,
      rules,
      label,
      noStyle,
    },
    componentProps: {
      children,
      onChange,
    },
  },
  disabled,
}) => (
  <Item
    name={ name }
    rules={ rules }
    label={ label }
    valuePropName="checked"
    noStyle={ noStyle }
  >
    <Checkbox
      disabled={ disabled }
      onChange={ onChange }
    >
      { children }
    </Checkbox>
  </Item>
);

export default FormCheckbox;
