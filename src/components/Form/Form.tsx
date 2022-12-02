import React, {
  CSSProperties,
  PropsWithChildren,
  ReactElement,
  useEffect,
} from 'react';
import {
  Button,
  Form as AntdForm,
  notification,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import {
  FormLayout,
  FormProps,
} from 'antd/lib/form/Form';
import { FormFieldItem } from 'types';
import FormItem from 'antd/lib/form/FormItem';
import { changedFieldsNamesVar } from 'vars';
import renderFormFields from './renderFormFields';
import {
  onFieldsWithNotificationChange,
  notificationKey,
} from './formHelpers';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void | Promise<void>,
  // optional
  fields?: Array<FormFieldItem | undefined | boolean>,
  form?: FormInstance,
  footer?: ReactElement | false,
  initialValues?: Record<string, unknown>,
  buttonText?: string,
  onValuesChange?: FormProps['onValuesChange'],
  onFieldsChange?: FormProps['onFieldsChange'],
  isChangeNotificationsEnabled?: boolean,
  isSubmitButtonVisible?: boolean,
  isLoading?: boolean,
  // layout
  style?: CSSProperties,
  layout?: FormLayout,
  labelCol?: number,
  wrapperCol?: number
}

const Form: React.FC<PropsWithChildren<Props>> = ({
  // required
  fields,
  onSubmit,
  // optional
  children,
  footer,
  form,
  initialValues,
  buttonText = 'Save',
  onValuesChange,
  onFieldsChange,
  isChangeNotificationsEnabled = false,
  isSubmitButtonVisible = true,
  isLoading,
  // layout
  style,
  layout = 'vertical',
  labelCol = 24,
  wrapperCol = 24,
}) => {
  useEffect(() => () => {
    changedFieldsNamesVar([]);
    notification.close(notificationKey);
  }, []);

  return (
    <AntdForm
      style={ style }
      form={ form }
      labelCol={ { span: labelCol } }
      wrapperCol={ { span: wrapperCol } }
      onFinish={ values => {
        notification.close(notificationKey);
        onSubmit(values);
      } }
      initialValues={ initialValues }
      layout={ layout }
      scrollToFirstError
      onValuesChange={ onValuesChange }
      onFieldsChange={ (isChangeNotificationsEnabled && form)
        ? onFieldsWithNotificationChange(form)
        : onFieldsChange
      }
    >
      { children }
      { fields && renderFormFields(fields.filter(Boolean)) }
      { isSubmitButtonVisible &&
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            loading={ isLoading }
            block
          >
            { buttonText }
          </Button>
        </FormItem>
      }
      { footer }
    </AntdForm>
  );
};

export default Form;
