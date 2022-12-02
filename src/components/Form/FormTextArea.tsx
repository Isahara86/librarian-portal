import React from 'react';
import { FormTextArea } from 'types';
import {
  Input,
  Form,
  Typography,
  Space,
} from 'antd';
import { TextAreaProps } from 'antd/lib/input';
import { FormInstance } from 'antd/es/form/Form';

const { TextArea } = Input;
const { Item } = Form;
const { Text } = Typography;

interface Props {
  field: FormTextArea,
  disabled: TextAreaProps['disabled'],
  bordered?: TextAreaProps['bordered'],
  style?: TextAreaProps['style'],
  getFieldValue: FormInstance['getFieldValue']
}

const FormTextArea: React.FC<Props> = ({
  field: {
    formItemProps: {
      name,
      rules,
      normalize,
      label,
    },
    componentProps: {
      autoSize,
      placeholder,
      renderCopyIcon,
    },
  },
  disabled,
  bordered,
  style,
  getFieldValue,
}) => (
  <Item
    name={ name }
    rules={ rules }
    normalize={ normalize }
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
  >
    <TextArea
      // placeholder={ placeholder }
      disabled={ disabled }
      autoSize={ autoSize }
      bordered={ bordered }
      placeholder={ placeholder }
      style={ style }
    />
  </Item>
);

export default FormTextArea;
