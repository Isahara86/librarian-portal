import { LoadingOutlined } from '@ant-design/icons';
import {
  Select,
  SelectProps,
} from 'antd';
import { FC } from 'react';

const AutoComplete: FC<SelectProps> = ({
  disabled,
  placeholder,
  onSearch,
  onDropdownVisibleChange,
  onChange,
  onSelect,
  onClear,
  value,
  loading,
  options,
  children,
  listHeight,
  suffixIcon,
}) => (
  <Select
    showSearch
    disabled={ disabled }
    loading={ loading }
    placeholder={ placeholder }
    optionLabelProp="label"
    value={ value }
    onChange={ onChange }
    onDropdownVisibleChange={ onDropdownVisibleChange }
    listHeight={ listHeight }
    style={ {
      width: '100%',
      minWidth: '10rem',
      maxWidth: '100%',
    } }
    onClear={ onClear }
    onSelect={ onSelect }
    onSearch={ onSearch }
    notFoundContent={
          loading
            ? <LoadingOutlined />
            : 'No Matches'
        }
    defaultActiveFirstOption={ false }
    dropdownMatchSelectWidth={ false }
    filterOption={ false }
    options={ options }
    suffixIcon={ suffixIcon }
  >
    { children }
  </Select>
);

export default AutoComplete;
