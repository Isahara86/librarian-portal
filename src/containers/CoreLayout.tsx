import enUS from 'antd/lib/locale/en_US';
import {
  ConfigProvider,
  Layout,
  Button,
  Space,
  Tag,
  Spin,
} from 'antd';
import {
  CenterBox,
  Header,
} from 'components';
import {
  LeftOutlined,
  SyncOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { ErrorBoundary } from 'react-error-boundary';
import {
  FC,
  PropsWithChildren,
} from 'react';
import moment from 'moment-timezone';
import { userVar } from 'vars';
import { useReactiveVar } from '@apollo/client';

// TODO change for europe
moment.tz.setDefault('America/Los_Angeles');

Spin.setDefaultIndicator(<LoadingOutlined style={ { fontSize: 24 } } spin />);

const { Content } = Layout;
const { Group } = Button;

const FallbackComponent: FC<PropsWithChildren<{ resetErrorBoundary: () => void }>> = ({ resetErrorBoundary }) => (
  <CenterBox>
    <Space direction="vertical" align="center" size="large">
      <Tag color="red">
        Something Went Wrong
      </Tag>
      <Group>
        <Button
          type="primary"
          onClick={ resetErrorBoundary }
          icon={ <LeftOutlined /> }
        >
          Go Back
        </Button>
        <Button
          type="primary"
          onClick={ resetErrorBoundary }
          icon={ <SyncOutlined /> }
        >
          Refresh
        </Button>
      </Group>
    </Space>
  </CenterBox>
);

const CoreLayout: FC<PropsWithChildren<unknown>> = ({ children }) => {
  // TODO move to header
  const user = useReactiveVar(userVar);

  return (
    <ConfigProvider locale={ enUS }>
      <Layout
        style={ {
          height: '100%',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
        } }
      >
        <Layout
          style={ {
            overflow: 'overlay',
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            backgroundColor: 'white',
          } }
        >
          { user && <Header /> }
          <Content
            style={ {
              flex: '1 1 auto',
              position: 'relative',
              padding: '1rem 1.5rem 2rem 1.5rem',
              height: 'calc(100% - 2rem - 48px)',
              overflow: 'scroll',
            } }
          >
            <ErrorBoundary FallbackComponent={ FallbackComponent }>
              { children }
            </ErrorBoundary>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default CoreLayout;
