import React, { useState } from 'react';
import {
  LoadingOutlined, PlusOutlined,
} from '@ant-design/icons';
import {
  message,
  Upload,
  Form,
} from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type {
  RcFile, UploadFile, UploadProps,
} from 'antd/es/upload/interface';
import { FormInstance } from 'antd/lib/form';

const { useFormInstance } = Form;

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }

  // return isJpgOrPng && isLt2M;
  return false;
};

interface Props {
  form: FormInstance;
}

const BookImageUpload: React.FC<Props> = ({ form }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps['onChange'] = async (info: UploadChangeParam<UploadFile>) => {
    // if (info.file.status === 'uploading') {
    //   setLoading(true);
    //
    //   return;
    // }
    // if (info.file.status === 'done') {
    // Get this url from response in real world.

    // getBase64(info.file.originFileObj as RcFile, url => {
    //   setLoading(false);
    //   setImageUrl(url);
    // });
    // }

    let src = info.file.url as string;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        // reader.readAsDataURL(info.file.originFileObj as RcFile);
        const file = info.file instanceof Blob ? info.file : info.file.originFileObj;
        reader.readAsDataURL(file as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });

      setLoading(false);
      setImageUrl(src);
      form.setFieldValue('previewImage', info.file);
    }
  };

  const uploadButton = (
    <div>
      { loading ? <LoadingOutlined /> : <PlusOutlined /> }
      <div style={ { marginTop: 8 } }>Upload</div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={ false }
      beforeUpload={ beforeUpload }
      onChange={ handleChange }
    >
      { imageUrl ? <img src={ imageUrl } alt="avatar" style={ { width: '100%' } } /> : uploadButton }
    </Upload>
  );
};

export default BookImageUpload;
