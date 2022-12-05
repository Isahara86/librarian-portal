import { gql } from '@apollo/client';

export const ADMIN_LOGIN = gql`
  mutation AdminLogin($input: AdminLoginInput!) {
      adminLogin(input: $input) {
          name
          token
     }
  }
`;
//
// export const ADMIN_ME = gql`
//     query AdminMe {
//         adminMe {
//             name
//         }
//     }
// `;
