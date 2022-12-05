import { makeVar } from '@apollo/client';
import { NamePath } from 'antd/lib/form/interface';
import { TableState } from 'types';

export const userVar = makeVar<{ name: string } | null>(null);
export const tokenVar = makeVar<string | null>(null);
export const changedFieldsNamesVar = makeVar<NamePath[]>([]);

export const tableStateVar = <T extends TableState>() => makeVar<T>({
  limit: 40,
  offset: 0,
  query: undefined,
} as T);
