import React from 'react';
import { FormRadioButtonGroup } from 'types';
import {
  Radio,
  Form,
} from 'antd';

const { Item } = Form;
const { Group } = Radio;

interface Props {
  field: FormRadioButtonGroup,
  disabled: boolean
}

const FormRadioButtonGroup: React.FunctionComponent<Props> = ({ field, disabled }) => (
  <Item
    name={ field.formItemProps.name }
    rules={ field.formItemProps.rules }
    label={ field.formItemProps.label }
    normalize={ field.formItemProps.normalize }
    noStyle={ field.formItemProps.noStyle }
  >
    <Group
      disabled={ disabled }
      optionType="button"
      buttonStyle="solid"
      options={ field.componentProps.options }
    />
  </Item>
);

export default FormRadioButtonGroup;
