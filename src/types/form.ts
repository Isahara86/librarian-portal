/* eslint-disable import/no-cycle */
import {
  InputProps,
  TextAreaProps,
} from 'antd/lib/input';
import { CheckboxProps } from 'antd/lib/checkbox';
import { InputNumberProps } from 'antd/lib/input-number';
import { DatePickerProps } from 'antd/lib/date-picker';
import {
  SelectProps,
  SelectValue,
} from 'antd/lib/select';
import { RadioGroupProps } from 'antd/lib/radio';
import { FormItemProps } from 'antd/lib/form';
import {
  SwitchProps, UploadProps,
} from 'antd';
import { ReactElement } from 'react';
import { NamePath } from 'antd/lib/form/interface';
import { Override } from './common';

export enum FormComponentType {
  INPUT = 'input',
  NUMBER = 'number',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  SWITCH = 'switch',
  TEXTAREA = 'textArea',
  RADIOBUTTONGROUP = 'radioButtonGroup',
  DATE = 'date',
  COLOR = 'color',
  UPLOAD = 'upload',
  PASSWORD = 'password',
  PHONE = 'phone',
  HIDDEN = 'hidden',
}

export type GetFieldValueFunc = (name: NamePath) => boolean

export type DisabledFunc = (getFieldValue: GetFieldValueFunc) => boolean;

export type BaseComponent<T extends FormComponentType, C extends { disabled?: boolean }> = {
  type: T
  componentProps: Override<C, { disabled?: C['disabled'] | DisabledFunc}>
  formItemProps: Override<FormItemProps, { name: NamePath }>
}

export type FormRadioButtonGroup = BaseComponent<FormComponentType.RADIOBUTTONGROUP, RadioGroupProps>

export type FormInput = BaseComponent<FormComponentType.INPUT | FormComponentType.PASSWORD, InputProps & { renderCopyIcon?: boolean }>

export type FormInputNumber = BaseComponent<FormComponentType.NUMBER, InputNumberProps>

export type FormDatePicker = BaseComponent<FormComponentType.DATE, DatePickerProps>

export type FormTextArea = BaseComponent<FormComponentType.TEXTAREA, TextAreaProps & { renderCopyIcon?: boolean }>

export type FormSelect = BaseComponent<FormComponentType.SELECT, SelectProps<SelectValue>>

export type FormCheckbox = BaseComponent<FormComponentType.CHECKBOX, CheckboxProps>

export type FormSwitch = BaseComponent<FormComponentType.SWITCH, SwitchProps>

export type FormUpload = BaseComponent<FormComponentType.UPLOAD, UploadProps>

export type FormPhone = BaseComponent<FormComponentType.PHONE, InputProps>

export type FormField =
  FormRadioButtonGroup |
  FormInput |
  FormInputNumber |
  FormDatePicker |
  FormTextArea |
  FormSelect |
  FormCheckbox |
  FormUpload |
  FormPhone |
  FormSwitch

export type FormFields = Record<string, FormField>;

export type FormFieldItem =
  FormField |
  (ReactElement | FormField)[] |
  ReactElement
