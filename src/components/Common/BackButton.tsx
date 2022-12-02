import { LeftOutlined } from '@ant-design/icons';
import {
  Space,
  Typography,
} from 'antd';
import { FC } from 'react';
import {
  Link,
  LinkProps,
  useLocation,
} from 'react-router-dom';
import { LocationState } from 'types';

const { Text } = Typography;

const BackButton: FC<LinkProps> = ({ to }) => {
  const location = useLocation() as {
    state?: LocationState
  };

  return (
    <Space>
      <LeftOutlined />
      <Link to={ location.state?.redirectFrom || to }>
        <Text>Back</Text>
      </Link>
    </Space>
  );
};

export default BackButton;
