import React from 'react';
import {
  Select, Form,
} from 'antd';
import { FormSelect } from 'types';

const { Option } = Select;

const { Item } = Form;

interface Props {
  field: FormSelect,
  disabled: boolean
}

const FormSelect: React.FC<Props> = ({
  field: {
    formItemProps: {
      name,
      rules,
      label,
      normalize,
    },
    componentProps: {
      placeholder,
      options,
      onDropdownVisibleChange,
      loading,
      children,
      optionLabelProp,
      bordered,
      mode,
      allowClear,
    },
  },
  disabled,
}) => (
  <Item
    name={ name }
    rules={ rules }
    label={ label }
    normalize={ normalize }
  >
    <Select
      mode={ mode }
      allowClear={ allowClear }
      showSearch
      style={ { width: '100%' } }
      optionFilterProp="children"
      dropdownMatchSelectWidth={ false }
      getPopupContainer={ node => node.parentNode }
      placeholder={ placeholder }
      loading={ loading }
      disabled={ disabled }
      optionLabelProp={ optionLabelProp }
      onDropdownVisibleChange={ onDropdownVisibleChange }
      bordered={ bordered }
      filterOption={ (input, option) => (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
      }
    >
      { children }
      { options?.map(({
        key,
        label,
      }) => (
        <Option key={ key } value={ key }>
          { label }
        </Option>
      )) }
    </Select>
  </Item>
);

export default FormSelect;
