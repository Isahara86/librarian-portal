import { useReactiveVar } from '@apollo/client';
import { FC } from 'react';
import {
  tokenVar, userVar,
} from 'vars';
import {
  Dropdown, Menu, Space, Typography,
} from 'antd';
import Cookies from 'js-cookie';

const { Text } = Typography;

export const RightHeader: FC = () => {
  const user = useReactiveVar(userVar);

  return (
    <div
      style={ {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: '100%',
        textAlign: 'right',
        flex: '0 1 auto',
      } }
    >
      <Space size={ 15 }>
        <Dropdown
          trigger={ ['hover'] }
          overlay={
            <Menu
              items={ [{
                key: 'logout',
                label: 'Log Out',
                onClick: () => {
                  Cookies.remove('token');
                  userVar(undefined);
                  tokenVar(undefined);
                },
              }] }
            />
          }
        >
          <Text
            style={ {
              color: '#DADADA',
              cursor: 'pointer',
            } }
          >
            { user?.name }
          </Text>
        </Dropdown>
      </Space>
    </div>
  );
};

export default RightHeader;
