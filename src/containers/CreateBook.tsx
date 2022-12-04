import {
  CSSProperties, FC,
} from 'react';
import {
  Button,
  Col, Divider, Image, Row, Tabs, Typography, Upload, Form as AntdForm,
} from 'antd';
import {
  BackButton, Form, renderFormFields,
} from 'components';
import {
  BookFragment, BookSearchInput, useBooksLazyQuery,
} from 'codegen';
import { useReactiveVar } from '@apollo/client';
import { tableStateVar } from 'vars';
import { useForm } from 'antd/lib/form/Form';
import links from 'links';
import { createPortal } from 'react-dom';
import { usePortal } from 'hooks';
import { getInputField } from 'utils';
import BookImageUpload from './BookImageUpload';

const stateVar = tableStateVar<BookSearchInput>();

const { Text } = Typography;

const columnHeight: CSSProperties['height'] = 'calc(100vh - 15rem)';

const CreateBook: FC = () => {
  const portalTarget = usePortal('productButtonContainer');
  const [form] = useForm();
  const [query, { loading, data }] = useBooksLazyQuery();

  const state = useReactiveVar(stateVar);

  const onSubmit = (...args: any[]) => console.log('Form submit 113', args);

  const isNewBook = true;
  const isLoading = false;

  return (
    <>
      <Row
        gutter={ [16, 16] }
        justify="space-between"
        align="middle"
      >
        <Col>
          <BackButton to={ links.books } />
        </Col>
        <Col id="productButtonContainer" />
      </Row>
      <Divider style={ { margin: '15px 0 5px 0' } } />
      <Form
        form={ form }
        initialValues={ {} }
        isSubmitButtonVisible={ false }
        onSubmit={ onSubmit }
      >
        { createPortal(
          <Button
            type="primary"
            onClick={ form.submit }
            loading={ isLoading }
          >
            { isNewBook ? 'Save' : 'Update' }
          </Button>,
          portalTarget,
        ) }
        <Row gutter={ [16, 16] }>
          <Col
            flex="1"
            style={ {
              height: columnHeight,
              overflowY: 'scroll',
            } }
          >
            { renderFormFields([
              getInputField({
                componentProps: { },
                formItemProps: {
                  name: 'name',
                  label: 'Name',
                  required: true,
                },
              }),

              getInputField({
                componentProps: { },
                formItemProps: {
                  name: 'description',
                  label: 'Description',
                  required: false,
                },
              }),

              // // eslint-disable-next-line react/jsx-key
              // <Upload
              //   showUploadList={ false }
              //   accept="image/png, image/jpeg"
              //   beforeUpload={ file => {
              //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //     // @ts-ignore
              //     const images = form.getFieldValue('images') as Array<Image> || [];
              //
              //     form.setFields([{
              //       name: 'images',
              //       value: images.concat(file),
              //     }]);
              //
              //     form.validateFields(['images']);
              //
              //     return false;
              //   } }
              // >
              //   <Button type="primary">
              //     Upload Image
              //   </Button>
              //   { /* <AntdForm.ErrorList errors={ errors } /> */ }
              // </Upload>,
              // eslint-disable-next-line react/jsx-key
              <BookImageUpload />,
            ]) }
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default CreateBook;
