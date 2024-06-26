import { Button, Flex, Text, Select } from '@radix-ui/themes';
import React from 'react';

type Props = {
  limit: number;
  offset: number;
  total: number;
  setLimit: (limit: number) => void;
  setOffset: (offset: number) => void;
};

const Pagination = ({ limit, offset, total, setLimit, setOffset }: Props) => {
  const totalPages = total;
  const currentPage = offset / limit + 1;
  const pages = [];
  const handleConvertPagination = (value: number) => {
    const modifyOffset = (value - 1) * limit;
    setOffset(modifyOffset);
  };

  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      pages.push(
        <Button
          className='cursor-pointer'
          key={i}
          onClick={() => handleConvertPagination(i)}
        >
          <b>{i}</b>
        </Button>
      );
    } else if (i <= 4 || i === totalPages || Math.abs(currentPage - i) === 1) {
      pages.push(
        <Button
          className='cursor-pointer'
          color='gray'
          key={i}
          onClick={() => handleConvertPagination(i)}
        >
          {i}
        </Button>
      );
    } else if (i === 5) {
      pages.push(<span key={i}>...</span>);
    }
  }

  return (
    <Flex gap='1' align='center' justify='between' mt='2' className='w-3/4 sm:w-full'>
      <Select.Root
        defaultValue={limit.toString()}
        onValueChange={(value) => setLimit(parseInt(value, 10))}
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Item value='2'>2</Select.Item>
          <Select.Item value='10'>10</Select.Item>
          <Select.Item value='15'>15</Select.Item>
          <Select.Item value='25'>25</Select.Item>
        </Select.Content>
      </Select.Root>
      <Text className='flex items-center gap-2'>
        {pages} de {totalPages}
      </Text>
    </Flex>
  );
};

export default Pagination;
