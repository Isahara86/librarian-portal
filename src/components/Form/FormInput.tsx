import React from 'react';
import {
  Form,
  Input,
  Space,
  Typography,
} from 'antd';
import { FormInput } from 'types';
import { FormInstance } from 'antd/es/form/Form';

const { Item } = Form;
const { Text } = Typography;

interface Props {
  field: FormInput,
  disabled: boolean,
  getFieldValue: FormInstance['getFieldValue']
}

const FormInput: React.FC<Props> = ({
  field: {
    formItemProps: {
      name,
      rules,
      label,
      required,
      normalize,
      noStyle,
      initialValue,
    },
    componentProps: {
      renderCopyIcon,
      type,
      prefix,
      placeholder,
      size,
      style,
      maxLength,
      bordered,
      addonAfter,
      suffix,
    },
  },
  disabled,
  getFieldValue,
}) => (
  <Item
    name={ name }
    rules={ rules }
    initialValue={ initialValue }
    label={ renderCopyIcon
      ? (
        <Space>
          { label }
          <Text
            copyable={ {
              onCopy: () => {
                const text = getFieldValue(name);
                if (text) {
                  window.navigator.clipboard.writeText(text);
                }
              },
            } }
          />
        </Space>
      ) : label
    }
    required={ required }
    normalize={ normalize }
    noStyle={ noStyle }
  >
    <Input
      suffix={ suffix }
      disabled={ disabled }
      type={ type }
      prefix={ prefix }
      placeholder={ placeholder }
      size={ size }
      style={ style }
      maxLength={ maxLength }
      bordered={ bordered }
      addonAfter={ addonAfter }
    />
  </Item>
);

export default FormInput;
