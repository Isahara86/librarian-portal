import React from 'react';
import {
  Form,
  Switch,
} from 'antd';
import { FormSwitch } from 'types';

const { Item } = Form;

interface Props {
  field: FormSwitch,
  disabled: boolean
}

const FormSwitch: React.FC<Props> = ({
  field: {
    formItemProps: {
      name,
      rules,
      label,
      noStyle,
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
    <Switch disabled={ disabled } />
  </Item>
);

export default FormSwitch;
