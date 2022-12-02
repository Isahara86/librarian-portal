import moment from 'moment-timezone';
import {
  FormField,
  GetFieldValueFunc,
} from 'types';

export const formatDate = (date: number): string => moment(date).format('DD.MM.YYYY');
export const formatDateTime = (date: number): string => moment(date).format('DD.MM.YYYY HH:mm');

export const isFieldDisabled = (field: FormField, getFieldValue: GetFieldValueFunc): boolean => {
  if (field.componentProps.disabled && typeof (field.componentProps.disabled) === 'function') {
    return field.componentProps.disabled(getFieldValue);
  }

  if (field.componentProps.disabled && typeof (field.componentProps.disabled) === 'boolean') {
    return field.componentProps.disabled;
  }

  return false;
};

export const percentageParser = (value: string) => value.replace('%', '');
export const percentageFormatter = (value: string) => `${value}%`;
