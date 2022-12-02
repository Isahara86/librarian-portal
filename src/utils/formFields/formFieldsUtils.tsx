import { MailOutlined } from '@ant-design/icons';
import {
  FormComponentType,
  FormInput,
  FormInputNumber,
  FormTextArea,
  FormSelect,
  FormCheckbox,
  FormRadioButtonGroup,
  // FormUpload,
  FormDatePicker,
  FormPhone,
  FormField,
  FormUpload,
  FormSwitch,
} from 'types';
import { Rule } from 'antd/lib/form';
import { parsePhoneNumber } from 'libphonenumber-js';
import { InputProps } from 'antd';

// rules
export const isPhoneValidRule = {
  required: true,
  validator: (_, value) => {
    try {
      const phone = parsePhoneNumber(value);

      if (phone.isValid()) {
        return Promise.resolve();
      }
    } catch (error) {
      return Promise.reject(new Error('Incorrect Phone'));
    }

    return Promise.reject(new Error('Incorrect Phone'));
  },
} as Rule;

const requiredRule = {
  required: true,
  message: 'Required',
} as Rule;

const emailRule = {
  type: 'email',
  message: 'Invalid Email',
} as Rule;

const getField = <C extends FormField> (type: C['type']) => ({
  formItemProps,
  componentProps,
}: {
  formItemProps: C['formItemProps'],
  componentProps: C['componentProps']
}) => ({
  formItemProps: {
    ...formItemProps,
    rules: formItemProps.required ? [requiredRule].concat(formItemProps.rules || []) : formItemProps.rules,
  },
  componentProps,
  type,
});

const getInputField = getField<FormInput>(FormComponentType.INPUT);

const getEmailField = ({
  isLabelVisible,
  isRequired,
  disabled,
  label,
  addonAfter,
}: {
  isLabelVisible: boolean,
  isRequired: boolean,
  disabled: boolean
  label?: string,
  addonAfter: InputProps['addonAfter']
}) => getInputField({
  formItemProps: {
    name: 'email',
    label,
    normalize: value => value.trim().toLowerCase(),
    rules: isRequired ? [emailRule, requiredRule] : [emailRule],
  },
  componentProps: {
    placeholder: 'Email',
    disabled,
    prefix: !isLabelVisible && <MailOutlined />,
    addonAfter,
  },
});

const getTextAreaField = getField<FormTextArea>(FormComponentType.TEXTAREA);

const getRadioButtonGroupField = getField<FormRadioButtonGroup>(FormComponentType.RADIOBUTTONGROUP);

const getNumberField = getField<FormInputNumber>(FormComponentType.NUMBER);

const getDatePickerField = getField<FormDatePicker>(FormComponentType.DATE);

const getSelectField = getField<FormSelect>(FormComponentType.SELECT);

const getCheckboxField = getField<FormCheckbox>(FormComponentType.CHECKBOX);

const getSwitchField = getField<FormSwitch>(FormComponentType.SWITCH);

const getPhoneField = getField<FormPhone>(FormComponentType.PHONE);

const getUpload = getField<FormUpload>(FormComponentType.UPLOAD);

export {
  requiredRule,
  getEmailField,
  getInputField,
  getNumberField,
  getRadioButtonGroupField,
  getDatePickerField,
  getSelectField,
  getSwitchField,
  getCheckboxField,
  getTextAreaField,
  getPhoneField,
  getUpload,
};
