import { Flex, Text } from '@radix-ui/themes'
import { DoubleArrowRightIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

export default function PatientsArea({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Flex direction='row' height='100vh' width='100vw'>
      <div className='h-full bg-zinc-300 w-64'>
        <Link href='/logged' className='flex justify-between items-center px-2 w-full bg-slate-50'>
          <Text>Pacientes</Text>
          <DoubleArrowRightIcon width={16} height={16} />
        </Link>
      </div>
      <Flex direction='column' p='4' flexGrow='1'>{children}</Flex>
    </Flex>
  );
}
