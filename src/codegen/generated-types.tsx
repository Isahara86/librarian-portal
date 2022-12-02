import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Timestamp: any;
  Upload: any;
};

export type AdminLoginInput = {
  login: Scalars['String'];
  password: Scalars['String'];
};

export type AdminLoginResponse = {
  __typename?: 'AdminLoginResponse';
  name: Scalars['String'];
  token: Scalars['String'];
};

export type Author = {
  __typename?: 'Author';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type AuthorCreateInput = {
  name: Scalars['String'];
};

export type AuthorSearchInput = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
};

export type AuthorUpdateInput = {
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type Book = {
  __typename?: 'Book';
  authors: Array<Author>;
  categories: Array<Category>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  isAvailable: Scalars['Boolean'];
  name: Scalars['String'];
  previewUrl?: Maybe<Scalars['String']>;
};

export type BookCreateInput = {
  authorIds: Array<Scalars['Int']>;
  categoryIds: Array<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  inventories: Array<BookInventoryCreateInput>;
  name: Scalars['String'];
  /** When not set previous value will be used */
  preview?: InputMaybe<Scalars['Upload']>;
};

export type BookDetails = {
  __typename?: 'BookDetails';
  authors: Array<Author>;
  categories: Array<Category>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  inventories: Array<BookInventoryDetails>;
  isAvailable: Scalars['Boolean'];
  name: Scalars['String'];
  previewUrl?: Maybe<Scalars['String']>;
};

export type BookInventory = {
  __typename?: 'BookInventory';
  book: Book;
  deleteReason?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  serialNumber: Scalars['String'];
};

export type BookInventoryCreateInput = {
  serialNumber: Scalars['String'];
};

export type BookInventoryDetails = {
  __typename?: 'BookInventoryDetails';
  activeReservation?: Maybe<BookInventoryReservation>;
  deleteReason?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  serialNumber: Scalars['String'];
};

export type BookInventoryReservation = {
  __typename?: 'BookInventoryReservation';
  /** milliseconds */
  createdAt?: Maybe<Scalars['Timestamp']>;
  customer: Customer;
  description?: Maybe<Scalars['String']>;
  /** milliseconds */
  endAt?: Maybe<Scalars['Timestamp']>;
  id: Scalars['Int'];
  /** milliseconds */
  returnedAt?: Maybe<Scalars['Timestamp']>;
  /** milliseconds */
  startAt?: Maybe<Scalars['Timestamp']>;
};

export type BookInventoryReservationCreateInput = {
  bookInventoryId: Scalars['Int'];
  customerId: Scalars['Int'];
  description: Scalars['String'];
  endAt: Scalars['Timestamp'];
  startAt: Scalars['Timestamp'];
};

export type BookInventoryReservationSearchInput = {
  bookId: Scalars['Int'];
  inventoryId?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type BookInventoryReservationUpdateInput = {
  bookInventoryId: Scalars['Int'];
  customerId: Scalars['Int'];
  description: Scalars['String'];
  endAt: Scalars['Timestamp'];
  id: Scalars['Int'];
  returnedAt?: InputMaybe<Scalars['Timestamp']>;
  startAt: Scalars['Timestamp'];
};

export type BookInventoryUpdateInput = {
  deleteReason: Scalars['String'];
  id: Scalars['Int'];
  serialNumber: Scalars['String'];
};

export type BookSearchInput = {
  authorIds?: InputMaybe<Array<Scalars['Int']>>;
  categoryIds?: InputMaybe<Array<Scalars['Int']>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  /** search by name, description */
  query?: InputMaybe<Scalars['String']>;
};

export type BookUpdateInput = {
  authorIds: Array<Scalars['Int']>;
  categoryIds: Array<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  name: Scalars['String'];
  newInventories: Array<BookInventoryCreateInput>;
  /** When not set previous value will be used */
  preview?: InputMaybe<Scalars['Upload']>;
  updatedInventories: Array<BookInventoryUpdateInput>;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type CategoryCreateInput = {
  name: Scalars['String'];
};

export type CategorySearchInput = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
};

export type CategoryUpdateInput = {
  id: Scalars['Int'];
  name: Scalars['String'];
};

/** customer  */
export type Customer = {
  __typename?: 'Customer';
  description?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  /** Customer nick name */
  name: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
};

export type CustomerCreateInput = {
  description?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  phone?: InputMaybe<Scalars['String']>;
};

/** customer  */
export type CustomerDetails = {
  __typename?: 'CustomerDetails';
  activeReservations: Array<CustomerDetailsReservation>;
  description?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  /** Customer nick name */
  name: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
};

export type CustomerDetailsReservation = {
  __typename?: 'CustomerDetailsReservation';
  bookInventory: BookInventory;
  /** milliseconds */
  createdAt?: Maybe<Scalars['Timestamp']>;
  description?: Maybe<Scalars['String']>;
  /** milliseconds */
  endAt?: Maybe<Scalars['Timestamp']>;
  id: Scalars['Int'];
  /** milliseconds */
  returnedAt?: Maybe<Scalars['Timestamp']>;
  /** milliseconds */
  startAt?: Maybe<Scalars['Timestamp']>;
};

export type CustomerReservationsSearchInput = {
  customerId: Scalars['Int'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type CustomerUpdateInput = {
  description?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  name: Scalars['String'];
  phone?: InputMaybe<Scalars['String']>;
};

export type CustomersSearchInput = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  adminLogin: AdminLoginResponse;
  createAuthor: Author;
  createBook: Book;
  createBookReservation: BookInventoryReservation;
  createCategory: Category;
  createCustomer: Customer;
  updateAuthor: Author;
  updateBook: Book;
  updateBookReservation: BookInventoryReservation;
  updateCategory: Category;
  updateCustomer: Customer;
};


export type MutationAdminLoginArgs = {
  input: AdminLoginInput;
};


export type MutationCreateAuthorArgs = {
  input: AuthorCreateInput;
};


export type MutationCreateBookArgs = {
  input: BookCreateInput;
};


export type MutationCreateBookReservationArgs = {
  input: BookInventoryReservationCreateInput;
};


export type MutationCreateCategoryArgs = {
  input: CategoryCreateInput;
};


export type MutationCreateCustomerArgs = {
  input: CustomerCreateInput;
};


export type MutationUpdateAuthorArgs = {
  input: AuthorUpdateInput;
};


export type MutationUpdateBookArgs = {
  input: BookUpdateInput;
};


export type MutationUpdateBookReservationArgs = {
  input: BookInventoryReservationUpdateInput;
};


export type MutationUpdateCategoryArgs = {
  input: CategoryUpdateInput;
};


export type MutationUpdateCustomerArgs = {
  input: CustomerUpdateInput;
};

export type Query = {
  __typename?: 'Query';
  authors: Array<Author>;
  bookDetails: BookDetails;
  bookReservationHistory: Array<BookInventoryReservation>;
  books: Array<Book>;
  categories: Array<Category>;
  customerDetails: Array<CustomerDetails>;
  customerReservationHistory: Array<CustomerDetailsReservation>;
  customers: Array<Customer>;
};


export type QueryAuthorsArgs = {
  input: AuthorSearchInput;
};


export type QueryBookDetailsArgs = {
  id: Scalars['Int'];
};


export type QueryBookReservationHistoryArgs = {
  input: BookInventoryReservationSearchInput;
};


export type QueryBooksArgs = {
  input: BookSearchInput;
};


export type QueryCategoriesArgs = {
  input: CategorySearchInput;
};


export type QueryCustomerDetailsArgs = {
  id: Scalars['Int'];
};


export type QueryCustomerReservationHistoryArgs = {
  input: CustomerReservationsSearchInput;
};


export type QueryCustomersArgs = {
  input: CustomersSearchInput;
};

export type BookFragment = { __typename?: 'Book', id: number, name: string, description?: string | null, previewUrl?: string | null, isAvailable: boolean };

export type BooksQueryVariables = Exact<{
  input: BookSearchInput;
}>;


export type BooksQuery = { __typename?: 'Query', books: Array<{ __typename?: 'Book', id: number, name: string, description?: string | null, previewUrl?: string | null, isAvailable: boolean }> };

export const BookFragmentDoc = gql`
    fragment Book on Book {
  id
  name
  description
  previewUrl
  isAvailable
}
    `;
export const BooksDocument = gql`
    query Books($input: BookSearchInput!) {
  books(input: $input) {
    ...Book
  }
}
    ${BookFragmentDoc}`;

/**
 * __useBooksQuery__
 *
 * To run a query within a React component, call `useBooksQuery` and pass it any options that fit your needs.
 * When your component renders, `useBooksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBooksQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useBooksQuery(baseOptions: Apollo.QueryHookOptions<BooksQuery, BooksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BooksQuery, BooksQueryVariables>(BooksDocument, options);
      }
export function useBooksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BooksQuery, BooksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BooksQuery, BooksQueryVariables>(BooksDocument, options);
        }
export type BooksQueryHookResult = ReturnType<typeof useBooksQuery>;
export type BooksLazyQueryHookResult = ReturnType<typeof useBooksLazyQuery>;
export type BooksQueryResult = Apollo.QueryResult<BooksQuery, BooksQueryVariables>;