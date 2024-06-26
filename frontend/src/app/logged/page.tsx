'use client';
import {
  Flex,
  Text,
  TextField,
} from '@radix-ui/themes';
import React, { useState, useEffect } from 'react';
import { Api } from '@/helpers/api';
import {
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons';
import { useToast } from '@/custom-hooks/useToast';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import PatientsForm from '@/components/PatientsForm';

type Patient = {
  id: string;
  name: string;
  email: string;
  phone_1: string;
  phone_2: string;
  birthdate: string;
  document: string;
  insuranceCardNumber: string;
  gender: 'M' | 'F';
};
export default function LoggedPage() {
  const [open, setOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(2);
  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState('');
  const [handleTimeout, setHandleTimeout] = useState<any>(null);
  const api = new Api();
  useEffect(() => {
    handleGetList();
  }, [limit, offset]);
  const { showToast } = useToast();
  const handleGetList = async (e?: React.FormEvent<HTMLInputElement>) => {
    setPatients([]);
    let queryExists = query;
    if (e) {
      queryExists = (e.target as HTMLInputElement).value;
    }
    let endpoint = `/patients/list?limit=${limit}&offset=${offset}`;
    if (queryExists) {
      endpoint += `&q=${queryExists}`;
    }
    const { data, count } = await api.get(endpoint);
    setPatients(data);
    setTotalPatients(count);
    const totalPages = Math.ceil(count / limit);
    setTotalPages(totalPages);
  };
  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    clearTimeout(handleTimeout);
    setHandleTimeout(
      setTimeout(async () => {
        handleGetList(e);
      }, 300)
    );
  };
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/patients/${id}`);
      handleGetList();
      showToast('Paciente excluído com sucesso!', 'success');
    } catch (err: any) {
      console.error(err);
    }
  };
  return (
    <Flex direction='column' flexGrow='1'>
      <Flex direction='row' align='center' justify='between' mb='3' className='w-3/4 sm:w-full'>
        <Text>Listagem de Pacientes</Text>
        <PatientsForm
          buttonText='Criar novo paciente'
          content='Cadastre seu paciente'
          open={open}
          setOpen={setOpen}
          title='Cadastro de pacientes'
          handleGetList={handleGetList}
          submitButtonText='Criar novo paciente'
          isEdit={false}
        />
      </Flex>
      <TextField.Root
        placeholder='Nome | Email | Documento | Carteirinha'
        radius='large'
        className='w-3/4 sm:w-full mb-2'
        onInput={(e) => handleSearch(e as React.FormEvent<HTMLInputElement>)}
        onKeyUp={({ target }) => setQuery((target as HTMLInputElement).value)}
      >
        <TextField.Slot>
          <MagnifyingGlassIcon width={16} height={16} />
        </TextField.Slot>
      </TextField.Root>
      <div className='w-3/4 sm:w-full overflow-x-auto'>
        <Table patients={patients} deletePatient={handleDelete} updatePatients={handleGetList} />
      </div>
      {totalPatients > 0 && (
        <Pagination
          limit={limit}
          offset={offset}
          total={totalPages}
          setLimit={setLimit}
          setOffset={setOffset}
        />
      )}
    </Flex>
  );
}
