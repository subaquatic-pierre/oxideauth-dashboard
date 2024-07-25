'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
// assets
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import { InputAdornment } from '@mui/material';
// material-ui
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';
import { ClosedCaptioning as CloseIcon } from '@phosphor-icons/react/dist/ssr';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

// types
interface Props extends OutlinedInputProps {
  value: string | number;
  onFilterChange: (value: string | number) => void;
  debounce?: number;
}

// ==============================|| FILTER - INPUT ||============================== //

export default function DebouncedInput({
  value: initialValue,
  onFilterChange,
  debounce = 500,
  size,
  startAdornment = (
    <InputAdornment position="start">
      <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
    </InputAdornment>
  ),
  ...props
}: Props) {
  const [value, setValue] = useState<number | string>(initialValue);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value);

  const endAdornment = (
    <InputAdornment
      sx={{
        fontSize: 'var(--icon-fontSize-md)',
        '&:hover': { cursor: 'pointer' }
      }}
      onClick={() => setValue('')}
      position="end"
    >
      <CloseCircleOutlined />
    </InputAdornment>
  );

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilterChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [value]);

  return (
    <OutlinedInput
      {...props}
      value={value}
      onChange={handleInputChange}
      sx={{ minWidth: 100, width: '100%' }}
      {...(startAdornment && { startAdornment })}
      {...(endAdornment && { endAdornment })}
      {...(size && { size })}
    />
  );
}
