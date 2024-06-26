import { SubmitHandler, useForm } from 'react-hook-form';
import DialogButton from './DialogButton';
import {
  Button,
  Card,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
} from '@radix-ui/themes';
import {
  EnvelopeClosedIcon,
  IdCardIcon,
  PersonIcon,
} from '@radix-ui/react-icons';
import { useState } from 'react';
import { useToast } from '@/custom-hooks/useToast';
import { Api } from '@/helpers/api';

type Patient = {
  id: string;
  name: string;
  email: string;
  phone_1: string;
  phone_2: string;
  phones?: {
    phone: string;
    id: string;
  }[];
  birthdate: string;
  document: string;
  insuranceCardNumber: string;
  gender: 'M' | 'F';
};

type Props = {
  open: boolean;
  buttonText: string;
  submitButtonText: string;
  patient?: Patient;
  content: string;
  isEdit: boolean;
  title: string;
  setOpen: (open: boolean) => void;
  handleGetList: () => void;
  handleEdit?: (data: any) => void;
};

export default function PatientsForm({
  open,
  setOpen,
  isEdit,
  submitButtonText,
  handleGetList,
  buttonText,
  content,
  patient,
  title,
  handleEdit,
}: Props) {
  const { register, handleSubmit, reset, watch } = useForm<Patient>();
  const [gender, setGender] = useState(patient?.gender as string);
  const { showToast } = useToast();
  const api = new Api();

  const onSubmit: SubmitHandler<Patient> = async (data) => {
    if (isEdit && handleEdit) {
      const { phone_1, phone_2, ...rest } = data;
      const phones =
        patient?.phones?.map((phone) => ({
          id: phone.id,
          phone: phone.phone,
        })) || [];
      if (phone_1) {
        phones[0].phone = phone_1;
      }
      if (phone_2) {
        phones[1].phone = phone_2;
      }
      handleEdit({
        ...rest,
        gender,
        birthdate: new Date(data.birthdate),
        phones,
        id: patient?.id,
      });
      return;
    }
    const newData = {
      ...data,
      phones: [data.phone_1, data.phone_2].filter((p) => p),
      gender,
      birthdate: new Date(data.birthdate),
      phone_1: undefined,
      phone_2: undefined,
    };
    try {
      await api.post('/patients', newData);
      reset();
      showToast('Paciente criado com sucesso!', 'success');
      handleGetList();
      setOpen(false);
    } catch (err: any) {
      if (err.message === 'INVALID_PHONE') {
        showToast('Telefone inválido', 'error');
        return;
      }
      if (err.message === 'PATIENT_ALREADY_EXISTS') {
        showToast('Paciente já cadastrado', 'error');
        return;
      }
    }
  };

  return (
    <DialogButton
      buttonColor='gray'
      open={open}
      isEdit={isEdit}
      openDialog={setOpen}
      buttonText={buttonText}
      title={title}
      content={content}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card aria-describedby='form-area'>
          <Text as='div' size='2' mb='2' weight='bold'>
            Nome
            <TextField.Root
              placeholder='Insira o nome do paciente'
              radius='large'
              defaultValue={isEdit ? patient?.name : ''}
              {...register('name', { required: true })}
            >
              <TextField.Slot>
                <PersonIcon width={16} height={16} />
              </TextField.Slot>
            </TextField.Root>
          </Text>
          {!isEdit && (
            <>
              <Text as='div' size='2' mb='2' weight='bold'>
                Documento
                <TextField.Root
                  placeholder='Insira o documento'
                  radius='large'
                  {...register('document', { required: true })}
                >
                  <TextField.Slot>
                    <IdCardIcon width={16} height={16} />
                  </TextField.Slot>
                </TextField.Root>
              </Text>
              <Text as='div' size='2' mb='2' weight='bold'>
                Número da Carteirinha
                <TextField.Root
                  placeholder='Insira o número da carteirinha'
                  radius='large'
                  {...register('insuranceCardNumber', { required: true })}
                >
                  <TextField.Slot>
                    <IdCardIcon width={16} height={16} />
                  </TextField.Slot>
                </TextField.Root>
              </Text>
              <Text as='div' size='2' mb='2' weight='bold'>
                Email
                <TextField.Root
                  placeholder='Insira o email do paciente'
                  type='email'
                  radius='large'
                  {...register('email', { required: true })}
                >
                  <TextField.Slot>
                    <EnvelopeClosedIcon width={16} height={16} />
                  </TextField.Slot>
                </TextField.Root>
              </Text>
            </>
          )}
          <div className='flex justify-between'>
            {patient?.phones?.length &&
              patient.phones.map((phone, index) => (
                <Text key={phone.id} as='div' size='2' weight='bold'>
                  Telefone {index + 1}
                  <TextField.Root
                    placeholder='Telefone'
                    radius='large'
                    defaultValue={isEdit ? phone.phone : ''}
                    {...register('phone_1', { required: true })}
                  />
                </Text>
              ))}
          </div>
          <div className='flex justify-between'>
            <div className='flex flex-col mt-4 w-2/5'>
              <Text size='2' weight='bold'>
                Aniversário
              </Text>
              <input
                type='date'
                className='border border-gray-300 rounded-lg p-2'
                defaultValue={
                  isEdit
                    ? new Date(patient?.birthdate!)
                        .toISOString()
                        .substring(0, 10)
                    : ''
                }
                {...register('birthdate', { required: true })}
              />
            </div>
            <div className='flex flex-col mt-4 w-2/5'>
              <Text size='2' weight='bold'>
                Gênero
              </Text>
              <Select.Root defaultValue={gender} onValueChange={setGender}>
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value='M'>Masculino</Select.Item>
                  <Select.Item value='F'>Feminino</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
          </div>
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
            {submitButtonText}
          </Button>
        </Flex>
      </form>
    </DialogButton>
  );
}
