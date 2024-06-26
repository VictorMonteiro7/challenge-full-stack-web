import { Button, Table, Text } from '@radix-ui/themes';
import { formatDate } from '@/helpers/formatDate';
import ActionsButton from './ActionsButton';
import PatientsForm from './PatientsForm';
import { useState } from 'react';
import { useToast } from '@/custom-hooks/useToast';
import { Api } from '@/helpers/api';

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

type Props = {
  patients: Patient[];
  deletePatient: (id: string) => void;
  updatePatients: () => void;
};

export default function TableComponent({ patients, deletePatient, updatePatients }: Props) {
  const [openForm, setOpenForm] = useState(false);
  const { showToast } = useToast();
  const api = new Api();
  const handleEditPatient = () => {
    setOpenForm(true);
  }
  const handleSendEditPatient = async (patient: any) => {
    try {
      await api.put(`/patients/${patient.id}`, patient);
      showToast('Paciente editado com sucesso!', 'success');
      setOpenForm(false);
      updatePatients();
    } catch (error) {
      showToast('Erro ao editar paciente!', 'error');
    }
  }
  return (
    <Table.Root variant='surface'>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Nome</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Dt. Nascimento</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Gênero</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>N. Carteirinha</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Ações</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {patients?.map((patient) => (
          <>
            <Table.Row key={patient.id}>
              <Table.RowHeaderCell>{patient.name}</Table.RowHeaderCell>
              <Table.Cell>{formatDate(patient.birthdate)}</Table.Cell>
              <Table.Cell>
                {patient.gender === 'M' ? 'Masculino' : 'Feminino'}
              </Table.Cell>
              <Table.Cell>{patient.insuranceCardNumber}</Table.Cell>
              <Table.Cell>
                <ActionsButton
                  actionText='Deletar paciente'
                  alertTitle='Tem certeza que deseja deletar o paciente?'
                  deleteAction={() => deletePatient(patient.id)}
                  editPatient={() => handleEditPatient()}
                  linkView={`/logged/${patient.id}`}
                />
              </Table.Cell>
            </Table.Row>
            {openForm && (
              <PatientsForm
                open={openForm}
                setOpen={setOpenForm}
                buttonText='Editar'
                submitButtonText='Salvar'
                content='Editar paciente'
                isEdit
                patient={patient}
                title='Editar paciente'
                handleGetList={() => {}}
                handleEdit={handleSendEditPatient}
              />
            )}
          </>
        ))}
        {!patients?.length && (
          <div className='flex justify-center items-center w-full'>
            <Text>No data!</Text>
          </div>
        )}
      </Table.Body>
    </Table.Root>
  );
}
