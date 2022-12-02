/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ReactiveVar } from '@apollo/client';
import {
  Button,
  Col,
  Row,
  Space,
  Table,
  TableProps,
} from 'antd';
import Search from 'antd/lib/input/Search';
import { ColumnProps } from 'antd/lib/table';
import { ExpandableConfig } from 'antd/lib/table/interface';
import { usePrevious } from 'hooks';
import {
  debounce,
  get,
  isEqual,
  sum,
} from 'lodash';
import {
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { TableState } from 'types';
import BaseLink from './BaseLink';

const getColumnWidth = <DataObject extends object, > (
  column: ColumnProps<DataObject>,
  dataSource: TableProps<DataObject>['dataSource'],
) => {
  let columnWidth = 0;

  const headerAddon = 7;
  const dataAddon = 4;
  const multiplicator = 8;

  // initialize column title length
  if (!('children' in column)) {
    if (column.title && typeof column.title === 'string') {
      if (Array.isArray(column.dataIndex)) {
        columnWidth = (column.title.length + headerAddon) * multiplicator;
      }

      if (column.dataIndex && typeof column.dataIndex === 'string') {
        columnWidth = (column.title.length + headerAddon) * multiplicator;
      }
    }
  }

  dataSource?.forEach(row => {
    if (!('children' in column)) {
      if (column.title && typeof column.title === 'string') {
        if (Array.isArray(column.dataIndex)) {
          const value = get(row, column.dataIndex);

          if (value) {
            const dataTextLength = (value.length + dataAddon) * multiplicator;

            if (columnWidth < dataTextLength) {
              // if existing column title length is less than data length,
              // use more longer data length
              columnWidth = dataTextLength;
            }
          }
        }

        if (column.dataIndex && typeof column.dataIndex === 'string') {
          const value = get(row, column.dataIndex);

          if (value) {
            const dataTextLength = (value.length + dataAddon) * multiplicator;

            if (columnWidth < dataTextLength) {
              // if existing column title length is less than data length,
              // use more longer data length

              columnWidth = dataTextLength;
            }
          }
        }
      }
    }
  });

  return columnWidth;
};

type Variables<Input> = {
  variables: {
    input: Input
  }
}

type Props<DataObject extends object, Input extends TableState> = {
  // required for table
  state: Input,
  stateVar: ReactiveVar<Input>,
  dataSource: TableProps<DataObject>['dataSource'],
  columns: ColumnProps<DataObject>[],
  loading: TableProps<DataObject>['loading'],
  query: (variables: Variables<Input>) => Promise<unknown>,
  // required for top controls
  createButtonText?: string,
  createButtonLink?: string,
  customsButtons?: Array<{
    text: string,
    onClick: () => void
  }>,
  // optional
  scroll?: TableProps<DataObject>['scroll'],
  isColumnsWidthCalculated?: boolean,
  isInNewTabRedirect?: boolean,
  getRedirectLink?: (record: DataObject) => string,
  searchPlaceholder?: string,
  isSearchVisible?: boolean,
  totalRows?: number | undefined,
  topControls?: ReactNode
  expandable?: ExpandableConfig<DataObject>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatFilters?: (values: any) => Partial<Input>,
}

const BaseTable = <DataObject extends object, Input extends TableState> ({
  // required for table
  state,
  stateVar,
  dataSource,
  columns,
  loading,
  query,
  // right corner buttons
  createButtonText,
  createButtonLink,
  customsButtons,
  // optional
  scroll,
  isInNewTabRedirect,
  isColumnsWidthCalculated,
  getRedirectLink,
  searchPlaceholder,
  isSearchVisible = true,
  totalRows,
  expandable,
  formatFilters,
  topControls,
}: Props<DataObject, Input>) => {
  const navigate = useNavigate();

  const prevState = usePrevious(state);

  useEffect(() => {
    query({ variables: { input: state } });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // track state changes, skip query changes
    if (state.query === prevState?.query && !isEqual(state, prevState)) {
      query({ variables: { input: state } });
    }
  }, [prevState, query, state]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const search = useCallback(debounce(query, 1000), []);

  const location = useLocation();

  const cols = columns?.map(column => ({
    ...column,
    width: column.width === 'auto' ? getColumnWidth(column, dataSource) : column.width,
    // defaultSortOrder: (state.base.orderBy === column.dataIndex && (state.base.sortingOrder === SortingOrder.Asc ? 'ascend' : 'descend')) || null,
  }));

  const isTopRowVisible = !!(isSearchVisible || topControls || createButtonText || customsButtons);

  return (
    <Row gutter={ [24, 24] }>
      { isTopRowVisible &&
        <Col span={ 24 }>
          <Row gutter={ [16, 16] }>
            <Col flex="0">
              { isSearchVisible &&
                <Search
                  style={ { width: '25rem' } }
                  value={ state.query?.toString() }
                  placeholder={ searchPlaceholder }
                  onChange={ e => {
                    const newState: Input = {
                      ...state,
                      query: e.target.value || undefined,
                    };

                    stateVar(newState);

                    search({ variables: { input: newState } });
                  } }
                />
              }
            </Col>
            { topControls &&
              <Col flex="0">
                { topControls }
              </Col>
            }
            <Col flex="0" style={ { marginLeft: 'auto' } }>
              <Space>
                { customsButtons?.map(({ text, onClick }) => (
                  <Button key={ text } type="primary" onClick={ onClick }>
                    { text }
                  </Button>
                )) }
                { createButtonText && createButtonLink && (
                <Button type="primary">
                  <BaseLink to={ `${createButtonLink}/new` }>
                    { createButtonText }
                  </BaseLink>
                </Button>
                ) }
              </Space>
            </Col>
          </Row>
        </Col>
      }
      <Col span={ 24 }>
        <Table
          rowKey="id"
          dataSource={ dataSource }
          loading={ loading }
          expandable={ expandable }
          size="small"
          onRow={ record => ({
            onClick: () => {
              if (getRedirectLink) {
                if (isInNewTabRedirect) {
                  window.open(getRedirectLink(record), '_blank');
                } else {
                  navigate(getRedirectLink(record), { state: { redirectFrom: `${location.pathname}${location.search}` } });
                }
              }
            },
            style: { cursor: 'pointer' },
          }) }
          onHeaderRow={ () => ({ style: { fontSize: 14 } }) }
          onChange={ (pagination, filters, sorter) => {
            if (pagination.pageSize && pagination.current) {
              let base = {
                offset: pagination.pageSize * (pagination.current - 1),
                limit: pagination.pageSize,
              };

              // TODO fix antd typing
              // @ts-ignore
              if (sorter.column && sorter.order) {
                base = {
                  ...base,
                  // @ts-ignore
                  orderBy: sorter.column.dataIndex,
                  // @ts-ignore
                  // sortingOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
                };
              }

              let state = { ...base } as Input;

              if (filters && formatFilters) {
                state = {
                  ...state,
                  ...formatFilters(filters as Record<keyof DataObject, []>),
                };
              }

              stateVar(state);
            }
          } }
          pagination={ {
            // TODO fix scheme (required)
            current: (state.offset && state.limit) ? (state.offset / state.limit) + 1 : 1,
            showSizeChanger: true,
            total: totalRows,
            size: 'default',
            showTotal: total => `Total Rows ${total}`,
            defaultPageSize: state.limit,
            style: { marginBottom: 0 },
            position: ['bottomCenter'],
          } }
          scroll={ {
            x: isColumnsWidthCalculated ? sum(columns.map(col => col.width)) : undefined,
            y: 'calc(100vh - 15rem)',
            ...scroll,
          } }
          columns={ cols as ColumnProps<DataObject>[] }
        />
      </Col>
    </Row>
  );
};

export default BaseTable;
