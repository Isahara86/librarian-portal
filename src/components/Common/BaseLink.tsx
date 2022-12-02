import { FC } from 'react';
import {
  Link,
  LinkProps,
  useLocation,
} from 'react-router-dom';

type Props = LinkProps & { isInNewTabRedirect?: boolean }

const BaseLink: FC<Props> = ({ to, children, isInNewTabRedirect }) => {
  const location = useLocation();

  return (
    <Link
      to={ to }
      style={ { color: 'inherit' } }
      target={ isInNewTabRedirect ? '_blank' : undefined }
      rel={ isInNewTabRedirect ? 'noopener noreferrer' : undefined }
      state={ { redirectFrom: `${location.pathname}${location.search}` } }
    >
      { children }
    </Link>
  );
};

export default BaseLink;
