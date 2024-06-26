import { Flex, Popover, Button, Text } from '@radix-ui/themes';
import Logo from '~/public/Logo.svg';

type Props = {
  user: {
    name: string;
    email: string;
  }
  logout: () => void;
}

export default function Header({ user, logout }: Props) {
  const firstNameLetter = user.name.split('')[0].toUpperCase();
  return (
    <Flex
      flexGrow='1'
      p='2'
      justify='between'
      width='100vw'
      className='items-center bg-zinc-300'
    >
      <Logo />
      <div className='me-3'>
        <Popover.Root>
          <Popover.Trigger>
            <Button radius='full' className='cursor-pointer'>
              {firstNameLetter}
            </Button>
          </Popover.Trigger>
          <Popover.Content width='200px'>
            <Flex direction='column' gap='2'>
              <Text as='p' size='2'>
                {user.name}
              </Text>
              <Text as='p' size='1' color='gray'>
                {user.email}
              </Text>
              <Button className='cursor-pointer' onClick={logout}>Sair</Button>
            </Flex>
          </Popover.Content>
        </Popover.Root>
      </div>
    </Flex>
  );
}
