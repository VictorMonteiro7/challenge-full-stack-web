'use client';

import {
  Flex,
  Button,
  Card,
  Box,
  TextField,
  Heading,
  Skeleton,
} from '@radix-ui/themes';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EnvelopeClosedIcon, LockClosedIcon } from '@radix-ui/react-icons';
import { useForm, SubmitHandler } from 'react-hook-form';
import Medicine from '~/public/undrawn_medicine.svg';
import RegisterForm from '@/components/RegisterForm';
import { Api } from '@/helpers/api';
import { useToast } from '@/custom-hooks/useToast';

type Inputs = {
  email: string;
  password: string;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const api = new Api();

  useEffect(() => {
    handleRedirectToLoggedPage();
  }, []);

  const handleRedirectToLoggedPage = () => {
    if (localStorage.getItem('tkn_teste_isa')) {
      router.push('/logged');
      return;
    }
    setIsLoading(false);
  }

  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.password.length < 8) {
      showToast('Senha precisa ter no mínimo 8 caracteres!', 'warning');
      return;
    }
    try {
      const {
        data: { token },
      } = await api.post('/login', data);
      localStorage.setItem('tkn_teste_isa', token);
      router.push('/logged');
    } catch (err: any) {
      if (err.message === 'INVALID_PASSWORD') {
        showToast('Senha incorreta!', 'error');
      } else if (err.message === 'USER_NOT_FOUND') {
        showToast('Usuário não encontrado!', 'error');
      }
    }
  };
  return (
    <Flex
      flexGrow='1'
      height='100vh'
      className='flex-col items-normal justify-center lg:flex-row lg:items-center lg:justify-normal border-black'
    >
      {isLoading ? (
        <Skeleton className='w-full mb-4 lg:w-2/3 lg:mb-0 h-80' />
      ) : (
        <picture className='w-full mb-4 lg:w-2/3 lg:mb-0'>
          <Medicine className='w-full' />
        </picture>
      )}

      <Box flexGrow='1' className='px-5'>
        <Card>
          <Heading align='center' className='mb-3'>
            Faça seu login
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField.Root
              placeholder='Insira seu email'
              type='email'
              radius='large'
              {...register('email', { required: true })}
            >
              <TextField.Slot>
                <EnvelopeClosedIcon width={16} height={16} />
              </TextField.Slot>
            </TextField.Root>
            <TextField.Root
              placeholder='Insira sua senha'
              type='password'
              radius='large'
              className='mt-3'
              {...register('password', { required: true })}
            >
              <TextField.Slot>
                <LockClosedIcon width={16} height={16} />
              </TextField.Slot>
            </TextField.Root>
            <Flex justify='end' className='mt-3' gap='2'>
              <RegisterForm open={openDialog} openDialog={setOpenDialog} />
              <Button type='submit' color='blue' className='cursor-pointer'>
                Entrar
              </Button>
            </Flex>
          </form>
        </Card>
      </Box>
    </Flex>
  );
}
