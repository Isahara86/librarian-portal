import { FC } from 'react';
import { Typography } from 'antd';
import menus from 'menus';
import { BaseTable } from 'components';
import {
  BookFragment, BookSearchInput, useBooksLazyQuery,
} from 'codegen';
import { useReactiveVar } from '@apollo/client';
import { tableStateVar } from 'vars';

const stateVar = tableStateVar<BookSearchInput>();

const { Text } = Typography;

const Books: FC = () => {
  const [query, { loading, data }] = useBooksLazyQuery();

  const state = useReactiveVar(stateVar);

  return (
    <BaseTable<BookFragment, BookSearchInput>
      stateVar={ stateVar }
      state={ state }
      loading={ loading }
      dataSource={ data?.books }
      // totalRows={ data?.books.maxCount }
      isColumnsWidthCalculated
      query={ query }
      getRedirectLink={ record => `${menus.books.url}/${record.id}` }
      columns={ [
        {
          title: 'Id',
          dataIndex: 'id',
          render: (_, record) => (
            <Text copyable>
              { `${record.id}` }
            </Text>),
          width: 95,
        },
        {
          title: 'Name',
          dataIndex: 'name',
        },
        {
          title: 'Description',
          dataIndex: 'description',
        },
        {
          title: 'Is available',
          dataIndex: 'isAvailable',
          render: (_, record) => (record.isAvailable ? 'True' : 'False'),
        },
      ] }
    />
  );
};

export default Books;
