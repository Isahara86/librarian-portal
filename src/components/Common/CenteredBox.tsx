import React, { ReactElement } from 'react';

interface Props {
  children: ReactElement,
  width?: number
}

const CenterBox: React.FC<Props> = ({ children, width = 350 }) => (
  <div style={ {
    position: 'absolute',
    width: '100%',
    transform: 'translate(-50%, -50%)',
    top: '47%',
    left: '50%',
    margin: '0%',
    textAlign: 'center',
    maxWidth: `${width}px`,
  } }
  >
    { children }
  </div>
);

export default CenterBox;
