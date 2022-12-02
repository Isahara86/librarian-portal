import React from 'react';
import {
  RightHeader,
  LeftHeader,
} from 'components';

const Header: React.FC = () => (
  <header
    style={ {
      maxHeight: '48px',
      height: '48px',
      minHeight: '48px',
      padding: '0 1.5rem',
      display: 'flex',
      alignContent: 'center',
      background: '#293746',
    } }
  >
    <LeftHeader />
    <RightHeader />
  </header>
);

export default Header;
