import { FC } from 'react';
import {
  Route,
  Routes,
  BrowserRouter, Navigate,
} from 'react-router-dom';
import {
  CoreLayout,
  Books,
  SignIn,
} from 'containers';
import links from 'links';
import {
  ApolloProvider, useReactiveVar,
} from '@apollo/client';
import { userVar } from 'vars';
import apolloClient from './utils/apollo';

export type RedirectLocation = {
  state: {
    redirectFrom: string
  }
}

type RouteItem = {
  path: string,
  component?: FC,
  children?: Record<string, RouteItem>
  title?: string
}

type AppRoutes = {
  public: Record<string, RouteItem>,
  private: Record<string, RouteItem>
}

export const routes: AppRoutes = {
  public: {
    signIn: {
      path: links.signIn,
      component: SignIn,
    },
  },
  private: {
    books: {
      path: links.books,
      component: Books,
    },
  },
};

const PrivateRoute: FC<{ component: FC }> = ({ component: Component }) => {
  const redirectFrom = `${window.location.pathname}${window.location.search}`;
  const user = useReactiveVar(userVar);

  if (user) {
    return <Component />;
  }

  return (
    <Navigate
      to={ routes.public.signIn.path }
      state={ { redirectFrom } as RedirectLocation['state'] }
    />
  );
};

type PublicRoutes = typeof routes.public;
type PrivateRoutes = typeof routes.private;

const getPublicRoutes = (routes: PublicRoutes) => Object
  .values(routes)
  .map(({ path, component: Component }) => (
    Component &&
    <Route
      key={ path }
      path={ path }
      element={ <Component /> }
    />
  ));

const getPrivateRoutes = (routes: PrivateRoutes, parentPath = ''): JSX.Element[] => (
  Object
    .values(routes)
    .reduce<JSX.Element[]>((acc, { path, component, children }) => {
      if (component) {
        acc.push(
          <Route
            key={ parentPath ? `${parentPath}${path}` : path }
            path={ parentPath ? `${parentPath}${path}` : path }
            element={ <PrivateRoute component={ component } /> }
          />,
        );
      }

      if (children) {
        return acc.concat(getPrivateRoutes(children, `${parentPath}${path}`));
      }

      return acc;
    }, [])
);

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <ApolloProvider client={ apolloClient }>
      <CoreLayout>
        <Routes>
          { getPublicRoutes(routes.public) }
          { getPrivateRoutes(routes.private) }
          <Route path="*" element={ <SignIn /> } />
        </Routes>
      </CoreLayout>
    </ApolloProvider>
  </BrowserRouter>
);

export default AppRoutes;
