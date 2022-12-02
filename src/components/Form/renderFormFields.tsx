/* eslint-disable react/no-array-index-key */
/* eslint-disable  react/jsx-key */
import {
  Col, Form, Row,
} from 'antd';
import {
  FormUpload,
  FormSelect,
  FormInput,
  FormTextArea,
  FormDatePicker,
  FormInputNumber,
  FormCheckbox,
  FormRadioButtonGroup,
  FormTelephoneInput,
  FormSwitch,
} from 'components';
import { isFieldDisabled } from 'utils';
import {
  FormComponentType,
  FormFieldItem,
} from 'types';
import { ReactElement } from 'react';

const { Item } = Form;

const renderFormFields = (fields: Array<FormFieldItem>): Array<ReactElement> => fields.map((field, rowIndex) => {
  if (Array.isArray(field)) {
    return (
      <Row gutter={ [16, 16] }>
        { field.map((item, index) => (
          <Col
            key={ `fieldsBlock${rowIndex}${index}` }
            style={ { width: `${100 / field.length}%` } }
          >
            { renderFormFields([item]) }
          </Col>
        )) }
      </Row>
    );
  }

  if ('formItemProps' in field) {
    return (
      <Item
        noStyle
        key={ (Array.isArray(field.formItemProps.name) ? field.formItemProps.name.join('.') : field.formItemProps.name) }
        dependencies={ field.formItemProps.dependencies || [] }
      >
        { ({ getFieldValue }) => {
          const disabled = isFieldDisabled(field, getFieldValue);

          switch (field.type) {
            case FormComponentType.INPUT:
              return (
                <FormInput
                  field={ field }
                  disabled={ disabled }
                  getFieldValue={ getFieldValue }
                />
              );

            case FormComponentType.TEXTAREA:
              return (
                <FormTextArea
                  field={ field }
                  disabled={ disabled }
                  getFieldValue={ getFieldValue }
                />
              );

            case FormComponentType.DATE:
              return <FormDatePicker field={ field } disabled={ disabled } />;

            case FormComponentType.NUMBER:
              return <FormInputNumber field={ field } disabled={ disabled } />;

            case FormComponentType.SELECT:
              return <FormSelect field={ field } disabled={ disabled } />;

            case FormComponentType.PASSWORD:
              return (
                <FormInput
                  field={ field }
                  disabled={ disabled }
                  getFieldValue={ getFieldValue }
                />
              );

            case FormComponentType.CHECKBOX:
              return <FormCheckbox field={ field } disabled={ disabled } />;

            case FormComponentType.SWITCH:
              return <FormSwitch field={ field } disabled={ disabled } />;

            case FormComponentType.PHONE:
              return <FormTelephoneInput field={ field } disabled={ disabled } />;

            case FormComponentType.UPLOAD:
              return <FormUpload field={ field } />;

            case FormComponentType.RADIOBUTTONGROUP:
              return <FormRadioButtonGroup field={ field } disabled={ disabled } />;

            default:
              return null;
          }
        } }
      </Item>
    );
  }

  return field;
});

export default renderFormFields;
