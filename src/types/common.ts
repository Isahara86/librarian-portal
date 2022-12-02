import {
  InputMaybe,
  Scalars,
} from 'codegen';

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }
export type WithId<T> = T & { id: string };
export type Loadable<T> = { data: WithId<T>, loading: boolean }
export type Override<T1, T2> = Omit<T1, keyof T2> & T2;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type LocationState = {
  redirectFrom?: string
}

export type RawAppMenuItem = {
  url: string,
  title: string,
}

export type AppMenuItem = RawAppMenuItem & {
  links?: Record<string, AppMenuItem>
}

export type TableState = {
  // base: SearchBaseInput,
  offset?: InputMaybe<Scalars['Int']>,
  limit?: InputMaybe<Scalars['Int']>,
  query?: InputMaybe<Scalars['String']>
}
