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
import {
  ApolloProvider, useReactiveVar,
} from '@apollo/client';
import { userVar } from 'vars';
import apolloClient from './utils/apollo';
// eslint-disable-next-line import/no-cycle
import CreateBook from './containers/CreateBook';

export type RedirectLocation = {
  state: {
    redirectFrom: string
  }
}

interface RouteItem {
  path: string,
  component?: FC,
  children?: Record<string, RouteItem>
  title?: string
}

interface AppRoutes {
  public: Record<string, RouteItem>,
  private: Record<string, RouteItem>
}

export const routes = {
  public: {
    signIn: {
      path: '/sign-in',
      component: SignIn,
    },
  },
  private: {
    books: {
      path: '/books',
      component: Books,
    },
    createBook: {
      path: '/create-book',
      component: CreateBook,
    },
  },
} satisfies AppRoutes;

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

const getPublicRoutes = (routes: Record<string, RouteItem>) => Object
  .values(routes)
  .map(({ path, component: Component }) => (
    Component &&
    <Route
      key={ path }
      path={ path }
      element={ <Component /> }
    />
  ));

const getPrivateRoutes = (routes: Record<string, RouteItem>, parentPath = ''): JSX.Element[] => (
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

export const menus = {
  books: {
    title: 'Books',
    url: routes.private.books.path,
  },
  createBook: {
    title: 'CreateBook',
    url: routes.private.createBook.path,
  },
};

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
