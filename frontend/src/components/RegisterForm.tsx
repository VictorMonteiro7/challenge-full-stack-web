import {
  Dialog,
  Button,
  Card,
  TextField,
  Text,
  Flex,
  Tooltip,
} from '@radix-ui/themes';
import {
  LockClosedIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  PersonIcon,
  EnvelopeClosedIcon,
} from '@radix-ui/react-icons';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { passwordStrength } from 'check-password-strength';
import { Api } from '@/helpers/api';
import { ShowPassStrength } from './ShowPassStrength';
import { useToast } from '@/custom-hooks/useToast';
import DialogButton from './DialogButton';

type Inputs = {
  name: string;
  email: string;
  password: string;
};

type PassStrengthResult = 0 | 1 | 2 | 3;

type Props = {
  open: boolean;
  openDialog: (open: boolean) => void;
};

export default function RegisterForm({ open, openDialog }: Props) {
  const { register, handleSubmit, reset, watch } = useForm<Inputs>();
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<PassStrengthResult>(0);
  const { showToast } = useToast();
  const api = new Api();

  watch((data) => {
    const { password } = data;
    if (password) {
      const passStrength = passwordStrength(password)
        .id as unknown as PassStrengthResult;
      setStrength(passStrength);
    } else {
      setStrength(0);
    }
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await api.post('/register', data);
      reset();
      showToast('Usuário criado! Faça login normalmente.', 'success');
      openDialog(false);
    } catch (err: any) {
      if (err?.message === 'WEAK_PASSWORD') {
        showToast('Senha fraca!', 'error');
      }
    }
  };
  return (
    <DialogButton
      buttonColor='gray'
      buttonText='Criar conta'
      title='Criar conta'
      content='Preencha os campos abaixo para criar uma nova conta.'
      open={open}
      openDialog={openDialog}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card aria-describedby='form-area'>
          <Text as='div' size='2' mb='2' weight='bold'>
            Nome
            <TextField.Root
              placeholder='Insira seu nome'
              radius='large'
              {...register('name', { required: true })}
            >
              <TextField.Slot>
                <PersonIcon width={16} height={16} />
              </TextField.Slot>
            </TextField.Root>
          </Text>
          <Text as='div' size='2' mb='2' weight='bold'>
            Email
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
          </Text>
          <Text as='div' size='2' weight='bold'>
            Senha
            <TextField.Root
              placeholder='Insira sua senha'
              type={showPassword ? 'text' : 'password'}
              radius='large'
              {...register('password', { required: true })}
            >
              <TextField.Slot>
                <LockClosedIcon width={16} height={16} />
              </TextField.Slot>
              <TextField.Slot>
                {showPassword ? (
                  <Tooltip content='Esconder senha'>
                    <EyeClosedIcon
                      width={16}
                      height={16}
                      onClick={() => setShowPassword(false)}
                      className='cursor-pointer'
                    />
                  </Tooltip>
                ) : (
                  <Tooltip content='Mostrar senha'>
                    <EyeOpenIcon
                      width={16}
                      height={16}
                      onClick={() => setShowPassword(true)}
                      className='cursor-pointer'
                    />
                  </Tooltip>
                )}
              </TextField.Slot>
            </TextField.Root>
            <ShowPassStrength strength={strength} />
          </Text>
        </Card>
        <Flex justify='end' gap='3' mt='3'>
          <Dialog.Close>
            <Button variant='soft' color='gray' className='cursor-pointer'>
              Cancelar
            </Button>
          </Dialog.Close>
          <Button
            type='submit'
            variant='soft'
            color='blue'
            className='cursor-pointer'
          >
            Criar novo usuário
          </Button>
        </Flex>
      </form>
    </DialogButton>
  );
}
