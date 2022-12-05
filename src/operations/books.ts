import { gql } from '@apollo/client';

export const BOOK_FRAGMENT = gql`
  fragment Book on Book {
    id
    name
    description
    previewUrl
    isAvailable
  }
`;

export const Books = gql`
${BOOK_FRAGMENT}
  query Books($input: BookSearchInput!) {
    books(input: $input) {
      ...Book
    }
  }
`;

export const CreateBook = gql`
${BOOK_FRAGMENT}
  mutation CreateBook($input: BookCreateInput!) {
    createBook(input: $input) {
      ...Book
    }
  }
`;
