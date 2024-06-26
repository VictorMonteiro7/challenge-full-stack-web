import {
  Popover,
  Button,
  Flex,
  AlertDialog,
  IconButton,
} from '@radix-ui/themes';
import Link from 'next/link';
import { TokensIcon } from '@radix-ui/react-icons';

type Props = {
  linkView: string;
  alertTitle: string;
  actionText: string;
  deleteAction: () => void;
  editPatient: (patient: any) => void;
};

export default function ActionsButton({
  editPatient,
  linkView,
  alertTitle,
  deleteAction,
  actionText,
}: Props) {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <IconButton className='cursor-pointer'>
          <TokensIcon width={16} height={16} />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content width='120px'>
        <Flex direction='column' gap='2' align='end'>
          <Link href={linkView} className='cursor-pointer'>
            <Button className='cursor-pointer'>Visualizar</Button>
          </Link>
          <Button className='cursor-pointer' onClick={editPatient}>Editar</Button>
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button className='cursor-pointer' color='red'>
                Excluir
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Title>{alertTitle}</AlertDialog.Title>
              <AlertDialog.Description>
                Tem certeza que deseja excluir?
              </AlertDialog.Description>
              <Flex gap='3' mt='4' justify='end'>
                <AlertDialog.Cancel>
                  <Button variant='soft' color='gray'>
                    Cancelar
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button
                    onClick={deleteAction}
                    variant='solid'
                    color='red'
                    className='cursor-pointer'
                  >
                    {actionText}
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
