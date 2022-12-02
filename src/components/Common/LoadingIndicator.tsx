import {
  Col, Row, Spin,
} from 'antd';
import { FC } from 'react';

const LoadingIndicator: FC = () => (
  <Row style={ { height: '100%' } } justify="center" align="middle">
    <Col>
      <Spin spinning />
    </Col>
  </Row>
);

export default LoadingIndicator;
