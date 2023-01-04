import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** `Date` type as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type AdminInviteInput = {
  readonly login: Scalars['String'];
  readonly name: Scalars['String'];
  readonly password: Scalars['String'];
};

export type AdminLoginInput = {
  readonly login: Scalars['String'];
  readonly password: Scalars['String'];
};

export type AdminLoginResponse = {
  readonly name: Scalars['String'];
  readonly token: Scalars['String'];
};

export type Author = {
  readonly id: Scalars['Int'];
  readonly name: Scalars['String'];
};

export type AuthorCreateInput = {
  readonly name: Scalars['String'];
};

export type AuthorSearchInput = {
  readonly limit?: InputMaybe<Scalars['Int']>;
  readonly offset?: InputMaybe<Scalars['Int']>;
  readonly query?: InputMaybe<Scalars['String']>;
};

export type AuthorUpdateInput = {
  readonly id: Scalars['Int'];
  readonly name: Scalars['String'];
};

export type Book = {
  readonly authors: ReadonlyArray<Author>;
  readonly categories: ReadonlyArray<Category>;
  readonly description?: Maybe<Scalars['String']>;
  readonly id: Scalars['Int'];
  readonly isAvailable: Scalars['Boolean'];
  readonly languages: ReadonlyArray<Language>;
  readonly name: Scalars['String'];
  readonly previewJpeg?: Maybe<Scalars['String']>;
  readonly previewJpegThumbnail?: Maybe<Scalars['String']>;
  readonly previewOrig?: Maybe<Scalars['String']>;
  readonly previewWebp?: Maybe<Scalars['String']>;
  readonly previewWebpThumbnail?: Maybe<Scalars['String']>;
};

export type BookCreateInput = {
  readonly authorIds: ReadonlyArray<Scalars['Int']>;
  readonly categoryIds: ReadonlyArray<Scalars['Int']>;
  readonly description?: InputMaybe<Scalars['String']>;
  readonly inventories: ReadonlyArray<BookInventoryCreateInput>;
  readonly languages: ReadonlyArray<Scalars['String']>;
  readonly name: Scalars['String'];
  /** When not set previous value will be used */
  readonly preview?: InputMaybe<Scalars['Upload']>;
};

export type BookDetails = {
  readonly authors: ReadonlyArray<Author>;
  readonly categories: ReadonlyArray<Category>;
  readonly description?: Maybe<Scalars['String']>;
  readonly id: Scalars['Int'];
  readonly inventories: ReadonlyArray<BookInventoryDetails>;
  readonly isAvailable: Scalars['Boolean'];
  readonly languages: ReadonlyArray<Language>;
  readonly name: Scalars['String'];
  readonly previewJpeg?: Maybe<Scalars['String']>;
  readonly previewJpegThumbnail?: Maybe<Scalars['String']>;
  readonly previewOrig?: Maybe<Scalars['String']>;
  readonly previewWebp?: Maybe<Scalars['String']>;
  readonly previewWebpThumbnail?: Maybe<Scalars['String']>;
};

export type BookInventory = {
  readonly book: Book;
  readonly deleteReason?: Maybe<Scalars['String']>;
  readonly id: Scalars['Int'];
  readonly serialNumber: Scalars['String'];
};

export type BookInventoryCreateInput = {
  readonly serialNumber: Scalars['String'];
};

export type BookInventoryDetails = {
  readonly activeReservation?: Maybe<BookInventoryReservation>;
  readonly deleteReason?: Maybe<Scalars['String']>;
  readonly id: Scalars['Int'];
  readonly serialNumber: Scalars['String'];
};

export type BookInventoryReservation = {
  /** milliseconds */
  readonly createdAt?: Maybe<Scalars['Timestamp']>;
  readonly customer: Customer;
  readonly description?: Maybe<Scalars['String']>;
  /** milliseconds */
  readonly endAt?: Maybe<Scalars['Timestamp']>;
  readonly id: Scalars['Int'];
  /** milliseconds */
  readonly returnedAt?: Maybe<Scalars['Timestamp']>;
  /** milliseconds */
  readonly startAt?: Maybe<Scalars['Timestamp']>;
};

export type BookInventoryReservationCreateInput = {
  readonly bookInventoryId: Scalars['Int'];
  readonly customerId: Scalars['Int'];
  readonly description: Scalars['String'];
  readonly endAt: Scalars['Timestamp'];
  readonly startAt: Scalars['Timestamp'];
};

export type BookInventoryReservationSearchInput = {
  readonly bookId: Scalars['Int'];
  readonly inventoryId?: InputMaybe<Scalars['Int']>;
  readonly limit?: InputMaybe<Scalars['Int']>;
  readonly offset?: InputMaybe<Scalars['Int']>;
};

export type BookInventoryReservationUpdateInput = {
  readonly bookInventoryId: Scalars['Int'];
  readonly customerId: Scalars['Int'];
  readonly description: Scalars['String'];
  readonly endAt: Scalars['Timestamp'];
  readonly id: Scalars['Int'];
  readonly returnedAt?: InputMaybe<Scalars['Timestamp']>;
  readonly startAt: Scalars['Timestamp'];
};

export type BookInventoryUpdateInput = {
  readonly deleteReason?: InputMaybe<Scalars['String']>;
  readonly id: Scalars['Int'];
  readonly serialNumber: Scalars['String'];
};

export type BookSearchInput = {
  readonly authorIds?: InputMaybe<ReadonlyArray<Scalars['Int']>>;
  readonly categoryIds?: InputMaybe<ReadonlyArray<Scalars['Int']>>;
  readonly limit?: InputMaybe<Scalars['Int']>;
  readonly offset?: InputMaybe<Scalars['Int']>;
  /** search by name, description */
  readonly query?: InputMaybe<Scalars['String']>;
};

export type BookUpdateInput = {
  readonly authorIds: ReadonlyArray<Scalars['Int']>;
  readonly categoryIds: ReadonlyArray<Scalars['Int']>;
  readonly description?: InputMaybe<Scalars['String']>;
  readonly id: Scalars['Int'];
  readonly languages: ReadonlyArray<Scalars['String']>;
  readonly name: Scalars['String'];
  readonly newInventories: ReadonlyArray<BookInventoryCreateInput>;
  /** When not set previous value will be used */
  readonly preview?: InputMaybe<Scalars['Upload']>;
  readonly updatedInventories: ReadonlyArray<BookInventoryUpdateInput>;
};

export type Category = {
  readonly id: Scalars['Int'];
  readonly name: Scalars['String'];
};

export type CategoryCreateInput = {
  readonly name: Scalars['String'];
};

export type CategorySearchInput = {
  readonly limit?: InputMaybe<Scalars['Int']>;
  readonly offset?: InputMaybe<Scalars['Int']>;
  readonly query?: InputMaybe<Scalars['String']>;
};

export type CategoryUpdateInput = {
  readonly id: Scalars['Int'];
  readonly name: Scalars['String'];
};

/** customer  */
export type Customer = {
  readonly description?: Maybe<Scalars['String']>;
  readonly email?: Maybe<Scalars['String']>;
  readonly id: Scalars['Int'];
  /** Customer nick name */
  readonly name: Scalars['String'];
  readonly phone?: Maybe<Scalars['String']>;
};

export type CustomerCreateInput = {
  readonly description?: InputMaybe<Scalars['String']>;
  readonly email?: InputMaybe<Scalars['String']>;
  readonly name: Scalars['String'];
  readonly phone?: InputMaybe<Scalars['String']>;
};

/** customer  */
export type CustomerDetails = {
  readonly activeReservations: ReadonlyArray<CustomerDetailsReservation>;
  readonly description?: Maybe<Scalars['String']>;
  readonly email?: Maybe<Scalars['String']>;
  readonly id: Scalars['Int'];
  /** Customer nick name */
  readonly name: Scalars['String'];
  readonly phone?: Maybe<Scalars['String']>;
};

export type CustomerDetailsReservation = {
  readonly bookInventory: BookInventory;
  /** milliseconds */
  readonly createdAt?: Maybe<Scalars['Timestamp']>;
  readonly description?: Maybe<Scalars['String']>;
  /** milliseconds */
  readonly endAt?: Maybe<Scalars['Timestamp']>;
  readonly id: Scalars['Int'];
  /** milliseconds */
  readonly returnedAt?: Maybe<Scalars['Timestamp']>;
  /** milliseconds */
  readonly startAt?: Maybe<Scalars['Timestamp']>;
};

export type CustomerReservationsSearchInput = {
  readonly customerId: Scalars['Int'];
  readonly limit?: InputMaybe<Scalars['Int']>;
  readonly offset?: InputMaybe<Scalars['Int']>;
};

export type CustomerUpdateInput = {
  readonly description?: InputMaybe<Scalars['String']>;
  readonly email?: InputMaybe<Scalars['String']>;
  readonly id: Scalars['Int'];
  readonly name: Scalars['String'];
  readonly phone?: InputMaybe<Scalars['String']>;
};

export type CustomersSearchInput = {
  readonly limit?: InputMaybe<Scalars['Int']>;
  readonly offset?: InputMaybe<Scalars['Int']>;
  readonly query?: InputMaybe<Scalars['String']>;
};

export type Language = {
  readonly code: Scalars['String'];
  readonly name: Scalars['String'];
  readonly nativeName: Scalars['String'];
};

export type Mutation = {
  readonly adminLogin: AdminLoginResponse;
  readonly createAuthor: Author;
  readonly createBook: Book;
  readonly createBookReservation: BookInventoryReservation;
  readonly createCategory: Category;
  readonly createCustomer: Customer;
  readonly inviteAdmin: SuccessModel;
  readonly updateAuthor: Author;
  readonly updateBook: Book;
  readonly updateBookReservation: BookInventoryReservation;
  readonly updateCategory: Category;
  readonly updateCustomer: Customer;
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


export type MutationInviteAdminArgs = {
  input: AdminInviteInput;
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
  readonly authors: ReadonlyArray<Author>;
  readonly bookDetails: BookDetails;
  readonly bookReservationHistory: ReadonlyArray<BookInventoryReservation>;
  readonly books: ReadonlyArray<Book>;
  readonly categories: ReadonlyArray<Category>;
  readonly customerDetails: CustomerDetails;
  readonly customerReservationHistory: ReadonlyArray<CustomerDetailsReservation>;
  readonly customers: ReadonlyArray<Customer>;
  readonly languages: ReadonlyArray<Language>;
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

export type SuccessModel = {
  readonly success: Scalars['Boolean'];
};

export type BooksListQueryVariables = Exact<{
  input: BookSearchInput;
}>;


export type BooksListQuery = { readonly books: ReadonlyArray<{ readonly id: number, readonly name: string, readonly previewOrig?: string | null, readonly previewJpeg?: string | null, readonly previewWebp?: string | null, readonly previewJpegThumbnail?: string | null, readonly previewWebpThumbnail?: string | null, readonly description?: string | null, readonly isAvailable: boolean }> };

export type AdminLoginMutationVariables = Exact<{
  input: AdminLoginInput;
}>;


export type AdminLoginMutation = { readonly adminLogin: { readonly name: string, readonly token: string } };

export type CreateBookMutationVariables = Exact<{
  input: BookCreateInput;
}>;


export type CreateBookMutation = { readonly createBook: { readonly id: number } };

export type LanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type LanguagesQuery = { readonly languages: ReadonlyArray<{ readonly code: string, readonly name: string, readonly nativeName: string }> };

export type CategoriesQueryVariables = Exact<{
  input: CategorySearchInput;
}>;


export type CategoriesQuery = { readonly categories: ReadonlyArray<{ readonly id: number, readonly name: string }> };

export type AuthorsQueryVariables = Exact<{
  input: AuthorSearchInput;
}>;


export type AuthorsQuery = { readonly authors: ReadonlyArray<{ readonly id: number, readonly name: string }> };

export type CreateAuthorMutationVariables = Exact<{
  input: AuthorCreateInput;
}>;


export type CreateAuthorMutation = { readonly createAuthor: { readonly id: number } };

export type CreateCategoryMutationVariables = Exact<{
  input: CategoryCreateInput;
}>;


export type CreateCategoryMutation = { readonly createCategory: { readonly id: number } };

export type InviteAdminMutationVariables = Exact<{
  input: AdminInviteInput;
}>;


export type InviteAdminMutation = { readonly inviteAdmin: { readonly success: boolean } };

export type UpdateBookMutationVariables = Exact<{
  input: BookUpdateInput;
}>;


export type UpdateBookMutation = { readonly updateBook: { readonly id: number } };

export type BookDetailsQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type BookDetailsQuery = { readonly bookDetails: { readonly id: number, readonly name: string, readonly description?: string | null, readonly previewOrig?: string | null, readonly previewJpeg?: string | null, readonly previewWebp?: string | null, readonly previewJpegThumbnail?: string | null, readonly previewWebpThumbnail?: string | null, readonly categories: ReadonlyArray<{ readonly id: number, readonly name: string }>, readonly authors: ReadonlyArray<{ readonly id: number, readonly name: string }>, readonly languages: ReadonlyArray<{ readonly code: string, readonly name: string }>, readonly inventories: ReadonlyArray<{ readonly id: number, readonly serialNumber: string }> } };

export type CustomersQueryVariables = Exact<{
  input: CustomersSearchInput;
}>;


export type CustomersQuery = { readonly customers: ReadonlyArray<{ readonly id: number, readonly name: string, readonly email?: string | null, readonly phone?: string | null, readonly description?: string | null }> };

export type CustomerDetailsQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type CustomerDetailsQuery = { readonly customerDetails: { readonly id: number, readonly name: string, readonly email?: string | null, readonly phone?: string | null, readonly description?: string | null, readonly activeReservations: ReadonlyArray<{ readonly id: number, readonly createdAt?: any | null, readonly startAt?: any | null, readonly endAt?: any | null, readonly description?: string | null, readonly bookInventory: { readonly serialNumber: string, readonly book: { readonly id: number, readonly name: string, readonly previewOrig?: string | null, readonly previewJpeg?: string | null, readonly previewWebp?: string | null, readonly previewJpegThumbnail?: string | null, readonly previewWebpThumbnail?: string | null } } }> } };

export type CreateCustomerMutationVariables = Exact<{
  input: CustomerCreateInput;
}>;


export type CreateCustomerMutation = { readonly createCustomer: { readonly id: number } };

export type UpdateCustomerMutationVariables = Exact<{
  input: CustomerUpdateInput;
}>;


export type UpdateCustomerMutation = { readonly updateCustomer: { readonly id: number } };

export const BooksListDocument = gql`
    query booksList($input: BookSearchInput!) {
  books(input: $input) {
    id
    name
    previewOrig
    previewJpeg
    previewWebp
    previewJpegThumbnail
    previewWebpThumbnail
    description
    isAvailable
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class BooksListGQL extends Apollo.Query<BooksListQuery, BooksListQueryVariables> {
    override document = BooksListDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AdminLoginDocument = gql`
    mutation adminLogin($input: AdminLoginInput!) {
  adminLogin(input: $input) {
    name
    token
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AdminLoginGQL extends Apollo.Mutation<AdminLoginMutation, AdminLoginMutationVariables> {
    override document = AdminLoginDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateBookDocument = gql`
    mutation createBook($input: BookCreateInput!) {
  createBook(input: $input) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateBookGQL extends Apollo.Mutation<CreateBookMutation, CreateBookMutationVariables> {
    override document = CreateBookDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LanguagesDocument = gql`
    query languages {
  languages {
    code
    name
    nativeName
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LanguagesGQL extends Apollo.Query<LanguagesQuery, LanguagesQueryVariables> {
    override document = LanguagesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CategoriesDocument = gql`
    query categories($input: CategorySearchInput!) {
  categories(input: $input) {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CategoriesGQL extends Apollo.Query<CategoriesQuery, CategoriesQueryVariables> {
    override document = CategoriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AuthorsDocument = gql`
    query authors($input: AuthorSearchInput!) {
  authors(input: $input) {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AuthorsGQL extends Apollo.Query<AuthorsQuery, AuthorsQueryVariables> {
    override document = AuthorsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateAuthorDocument = gql`
    mutation createAuthor($input: AuthorCreateInput!) {
  createAuthor(input: $input) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateAuthorGQL extends Apollo.Mutation<CreateAuthorMutation, CreateAuthorMutationVariables> {
    override document = CreateAuthorDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateCategoryDocument = gql`
    mutation createCategory($input: CategoryCreateInput!) {
  createCategory(input: $input) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateCategoryGQL extends Apollo.Mutation<CreateCategoryMutation, CreateCategoryMutationVariables> {
    override document = CreateCategoryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InviteAdminDocument = gql`
    mutation inviteAdmin($input: AdminInviteInput!) {
  inviteAdmin(input: $input) {
    success
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InviteAdminGQL extends Apollo.Mutation<InviteAdminMutation, InviteAdminMutationVariables> {
    override document = InviteAdminDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateBookDocument = gql`
    mutation updateBook($input: BookUpdateInput!) {
  updateBook(input: $input) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateBookGQL extends Apollo.Mutation<UpdateBookMutation, UpdateBookMutationVariables> {
    override document = UpdateBookDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const BookDetailsDocument = gql`
    query bookDetails($id: Int!) {
  bookDetails(id: $id) {
    id
    name
    description
    previewOrig
    previewJpeg
    previewWebp
    previewJpegThumbnail
    previewWebpThumbnail
    categories {
      id
      name
    }
    authors {
      id
      name
    }
    languages {
      code
      name
    }
    inventories {
      id
      serialNumber
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class BookDetailsGQL extends Apollo.Query<BookDetailsQuery, BookDetailsQueryVariables> {
    override document = BookDetailsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CustomersDocument = gql`
    query customers($input: CustomersSearchInput!) {
  customers(input: $input) {
    id
    name
    email
    phone
    description
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CustomersGQL extends Apollo.Query<CustomersQuery, CustomersQueryVariables> {
    override document = CustomersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CustomerDetailsDocument = gql`
    query customerDetails($id: Int!) {
  customerDetails(id: $id) {
    id
    name
    email
    phone
    description
    activeReservations {
      id
      createdAt
      startAt
      endAt
      description
      bookInventory {
        serialNumber
        book {
          id
          name
          previewOrig
          previewJpeg
          previewWebp
          previewJpegThumbnail
          previewWebpThumbnail
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CustomerDetailsGQL extends Apollo.Query<CustomerDetailsQuery, CustomerDetailsQueryVariables> {
    override document = CustomerDetailsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateCustomerDocument = gql`
    mutation createCustomer($input: CustomerCreateInput!) {
  createCustomer(input: $input) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateCustomerGQL extends Apollo.Mutation<CreateCustomerMutation, CreateCustomerMutationVariables> {
    override document = CreateCustomerDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateCustomerDocument = gql`
    mutation updateCustomer($input: CustomerUpdateInput!) {
  updateCustomer(input: $input) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateCustomerGQL extends Apollo.Mutation<UpdateCustomerMutation, UpdateCustomerMutationVariables> {
    override document = UpdateCustomerDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }