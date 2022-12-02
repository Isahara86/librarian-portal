import { makeVar } from '@apollo/client';
import { NamePath } from 'antd/lib/form/interface';

// TODO change any to User type
export const userVar = makeVar<any | null>({});
export const tokenVar = makeVar<string | null>(null);
export const changedFieldsNamesVar = makeVar<NamePath[]>([]);
