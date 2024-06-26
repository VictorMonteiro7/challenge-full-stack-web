import { Dialog, Button } from '@radix-ui/themes';

type Props = {
  open: boolean;
  openDialog: (open: boolean) => void;
  buttonText: string;
  buttonColor: any;
  content: string;
  title: string;
  isEdit?: boolean;
  children: React.ReactNode;
};

export default function DialogButton({
  open,
  openDialog,
  buttonText,
  title,
  content,
  buttonColor,
  children,
  isEdit,
}: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={openDialog}>
      {!isEdit && (
        <Dialog.Trigger>
          <Button color={buttonColor} className='cursor-pointer'>
            {buttonText}
          </Button>
        </Dialog.Trigger>
      )}
      <Dialog.Content>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description size='2' mb='4'>{content}</Dialog.Description>
        {children}
      </Dialog.Content>
    </Dialog.Root>
  );
}
