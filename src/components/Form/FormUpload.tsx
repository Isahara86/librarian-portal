/* eslint-disable @typescript-eslint/no-unused-vars */

import React, {
  ReactElement,
  useState,
} from 'react';
import {
  Upload,
  message,
  Space,
  Form,
  Image,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';
import { FormUpload } from 'types';

const { Item } = Form;

interface Props {
  field: FormUpload,
  disabled?: boolean
}

const FormUpload: React.FC<Props> = ({ field, disabled }) => {
  const [image, setImage] = useState<{ src: string | null | undefined, visible: boolean }>();

  return (
    <Item
      name={ field.formItemProps.name }
      label={ field.formItemProps.label }
      valuePropName="fileList"
      getValueFromEvent={ e => {
        if (Array.isArray(e)) {
          return e;
        }

        return e && e.fileList;
      } }
    >
      <Upload
        disabled={ disabled }
        accept="image/jpeg, image/png"
        multiple
        listType={ field.componentProps.listType || 'picture-card' }
        showUploadList={ field.componentProps.showUploadList }
        onPreview={ file => setImage({
          src: file.thumbUrl, visible: true,
        }) }
        onRemove={ (file: UploadFile) => {
          if (file?.response) {
            return file.response.ref.delete();
          }

          return true;
        } }
        beforeUpload={ file => {
          if (file.size >= 10000000) {
            message.error('File Is Too Big, Max Size Is 10Mb');

            return Promise.reject(new Error());
          }

          return true;
        } }
        customRequest={ ({
          file,
          onError,
          onSuccess,
          onProgress,
        }) => {
          // eslint-disable-next-line no-console
          console.log(file);
        } }
      >
        { !field.componentProps.showUploadList && image?.src &&
        <Image
          style={ { display: 'none' } }
          src={ image?.src }
          width={ 0 }
          preview={ {
            visible: image?.visible,
            onVisibleChange: (visible, prevVisible) => (
              !visible &&
                    prevVisible &&
                    setImage({
                      src: null, visible: false,
                    })
            ),
          } }
        />
          }
        { !field.componentProps.showUploadList && !image?.src &&
        <div>
          <Space direction="vertical">
            <PlusOutlined />
            <div>
              Upload
            </div>
          </Space>
        </div>
        }
      </Upload>
    </Item>
  );
};

export default FormUpload;
