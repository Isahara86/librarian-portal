import {
  Form,
  LoadingIndicator,
} from 'components';
import { authFields } from 'utils';
import {
  Col,
  Row,
  Space,
} from 'antd';
import { useReactiveVar } from '@apollo/client';
import {
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  RedirectLocation,
  routes,
} from 'routes';
import React, {
  FC,
  useEffect,
  useState,
} from 'react';
import Text from 'antd/lib/typography/Text';
import { useForm } from 'antd/lib/form/Form';
import Cookies from 'js-cookie';
import menus from 'menus';
import {
  userVar,
  tokenVar,
} from 'vars';
import { useAdminLoginMutation } from 'codegen';

type SubmitFormData = {
  login: string,
  password: string,
  rememberMe: boolean
}

const getDataFromToken = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const buffer = Buffer.from(base64, 'base64');
  const jsonPayload = decodeURIComponent(buffer.toString().split('').map(c => `%${(`00${String(c).charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

  const parsedToken = JSON.parse(jsonPayload);

  const { name, sub } = parsedToken;

  return {
    id: sub, name,
  } as {
    id: number,
    name: string
  };
};

const SignInPage: FC = () => {
  const [adminLogin, adminLoginResult] = useAdminLoginMutation();
  // const [adminMe, adminMeResult] = useAdminMeLazyQuery();

  const user = useReactiveVar(userVar);

  const navigate = useNavigate();

  const location = useLocation() as RedirectLocation;

  const [isLoading, setIsLoading] = useState(true);

  // login from cookies
  useEffect(() => {
    (async () => {
      const token = Cookies.get('token');
      if (token) {
        // if token expired
        // if (new Date() > moment(exp * 1000).toDate()) {
        //   Cookies.remove('token');
        // } else {

        const { name } = getDataFromToken(token);
        tokenVar(token);
        userVar({ name });
      }

      setIsLoading(false);
    })();
  }, []);

  const [form] = useForm();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (user) {
    return (
      <Navigate to={ location?.state?.redirectFrom || routes.private.books.path } />
    );
  }

  return (
    <Row gutter={ [48, 16] } justify="center" align="middle" style={ { height: '100%' } }>
      <Col xs={ 24 } md={ 8 } lg={ 6 }>
        <Form
          form={ form }
          layout="vertical"
          isLoading={
              adminLoginResult.loading
          }
          fields={ [
            <Space
              key="wlc"
              direction="vertical"
              align="center"
              style={ { display: 'flex' } }
            >
              <Text style={ { display: 'block' } }>
                Welcome to Librarian! 👋🏻
              </Text>
              <Text style={ {
                display: 'block',
                width: 300,
                textAlign: 'center',
              } }
              >
                Please sign in using the login and password associated with your account.
              </Text>
            </Space>,
            authFields.login,
            authFields.password,
            authFields.rememberMe,
          ] }
          buttonText="Login"
          onSubmit={ async (formValues: SubmitFormData) => {
            const result = await adminLogin({
              variables: {
                input: {
                  login: formValues.login.replace(/\s/g, ''),
                  password: formValues.password,
                },
              },
            });

            const token = result.data?.adminLogin.token;

            if (token) {
              if (formValues.rememberMe) {
                Cookies.set('token', token);
              }
              tokenVar(token);

              const { name } = getDataFromToken(token);

              userVar({ name });
              navigate(menus.books.url);
            }
          } }
        />
      </Col>
    </Row>
  );
};

export default SignInPage;
