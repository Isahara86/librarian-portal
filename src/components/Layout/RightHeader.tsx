import { useReactiveVar } from '@apollo/client';
import { FC } from 'react';
import { userVar } from 'vars';

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
    />
  );
};

export default RightHeader;
