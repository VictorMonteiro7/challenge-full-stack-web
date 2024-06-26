'use client';

import { useEffect, useState } from 'react';
import { CopyIcon } from '@radix-ui/react-icons';
import { Badge, Button, Code, DataList, IconButton } from '@radix-ui/themes';
import { Flex } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Api } from '@/helpers/api';
import { formatDate } from '@/helpers/formatDate';
import { useToast } from '@/custom-hooks/useToast';

type Patient = {
  id: string;
  name: string;
  email: string;
  document: string;
  gender: 'M' | 'F';
  birthdate: string;
  insuranceCardNumber: string;
  createdAt: string;
  phones: {
    id: string;
    phone: string;
  }[];
};

export default function Page({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<Patient>();
  const router = useRouter();
  const { showToast } = useToast();
  const api = new Api();
  useEffect(() => {
    handleGetPatient();
  }, [params.slug]);
  const handleGetPatient = async () => {
    try {
      const res = await api.get(`/patients/${params.slug}`);
      setData(res.data);
    } catch (error) {
      router.back();
    }
  };
  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    showToast('Copiado com sucesso!', 'success');
  };
  if (!data) return <Badge>Carregando...</Badge>;
  return (
    <>
      <DataList.Root>
        <DataList.Item>
          <DataList.Label minWidth='88px'>ID</DataList.Label>
          <DataList.Value>
            <Flex align='center' gap='2'>
              <Code variant='ghost'>{data.id}</Code>
              <IconButton
                size='1'
                aria-label='Copiar valor'
                color='gray'
                variant='ghost'
                onClick={() => handleCopy(data.id)}
              >
                <CopyIcon />
              </IconButton>
            </Flex>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label minWidth='88px'>Nome</DataList.Label>
          <DataList.Value>{data.name}</DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label minWidth='88px'>Email</DataList.Label>
          <DataList.Value>
            <Link href={`mailto:${data.email}`}>{data.email}</Link>
          </DataList.Value>
        </DataList.Item>
        {data.phones?.map((phoneObj, index) => <DataList.Item key={index}>
            <DataList.Label minWidth='88px'>Telefone {index + 1}</DataList.Label>
            <DataList.Value>
              <Flex align='center' gap='2'>
                <Code variant='ghost'>{phoneObj.phone}</Code>
                <IconButton
                  size='1'
                  aria-label='Copiar valor'
                  color='gray'
                  variant='ghost'
                  onClick={() => handleCopy(phoneObj.phone)}
                >
                  <CopyIcon />
                </IconButton>
              </Flex>
            </DataList.Value>
          </DataList.Item>)}
        <DataList.Item>
          <DataList.Label minWidth='88px'>Documento</DataList.Label>
          <DataList.Value>
            <Flex align='center' gap='2'>
              <Code variant='ghost'>{data.document}</Code>
              <IconButton
                size='1'
                aria-label='Copiar valor'
                color='gray'
                variant='ghost'
                onClick={() => handleCopy(data.document)}
              >
                <CopyIcon />
              </IconButton>
            </Flex>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label minWidth='88px'>Gênero</DataList.Label>
          <DataList.Value>
            <Code variant='ghost'>
              {data.gender === 'M' ? 'Masculino' : 'Feminino'}
            </Code>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label minWidth='88px'>Carteirinha</DataList.Label>
          <DataList.Value>
            <Flex align='center' gap='2'>
              <Code variant='ghost'>{data.insuranceCardNumber}</Code>
              <IconButton
                size='1'
                aria-label='Copiar valor'
                color='gray'
                variant='ghost'
                onClick={() => handleCopy(data.insuranceCardNumber)}
              >
                <CopyIcon />
              </IconButton>
            </Flex>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label minWidth='88px'>Data de nascimento</DataList.Label>
          <DataList.Value>
            <Code variant='ghost'>{formatDate(data.birthdate)}</Code>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label minWidth='88px'>Criado em:</DataList.Label>
          <DataList.Value>
            <Code variant='ghost'>{formatDate(data.createdAt)}</Code>
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>
      <Button
        variant='soft'
        color='blue'
        className='cursor-pointer'
        mt='4'
        onClick={() => router.back()}
      >
        Voltar
      </Button>
    </>
  );
}
