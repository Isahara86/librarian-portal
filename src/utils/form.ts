import {
  FormInstance,
  message,
} from 'antd';
import { changedFieldsNamesVar } from 'vars';

const resetFieldsStatus = (form: FormInstance) => {
  const names = changedFieldsNamesVar();

  names.forEach(name => form.setFields([{
    name,
    touched: false,
  }]));

  changedFieldsNamesVar([]);
};

// eslint-disable-next-line import/prefer-default-export
export const setForm = <T>(form: FormInstance, object: T | null | undefined, isSuccessMessageShown = true) => {
  if (object) {
    form.setFieldsValue(object);

    resetFieldsStatus(form);

    if (isSuccessMessageShown) {
      message.success('Success');
    }
  }
};
