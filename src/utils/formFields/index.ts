import {
  login, otp, password,
} from './input';
import { rememberMe } from './checkbox';
import { phone } from './phone';

export const authFields = {
  phone,
  login,
  password,
  rememberMe,
};

export * from './formFieldsUtils';
