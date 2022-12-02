import React from 'react';
import {
  Form, InputNumber,
} from 'antd';
import { FormInputNumber } from 'types';

const { Item } = Form;

interface Props {
  field: FormInputNumber,
  disabled: boolean,
}

const FormInputNumber: React.FC<Props> = ({
  field: {
    componentProps: {
      min,
      precision,
      step,
    },
    formItemProps: {
      name,
      rules,
      label,
      normalize,
      noStyle,
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
    <InputNumber
      style={ { width: '100%' } }
      disabled={ disabled }
      min={ min }
      precision={ precision }
      step={ step }
    />
  </Item>
);

export default FormInputNumber;
