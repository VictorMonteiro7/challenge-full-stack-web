import Link from 'next/link'
import { Button, Flex } from '@radix-ui/themes'
import NotFoundSVG from '~/public/undraw_page_not_found.svg';
export default function NotFound() {
  return (
    <Flex flexGrow='1' height='100vh' className='justify-center'>
      <div className='flex-col items-center w-1/2 my-auto'>
        <NotFoundSVG />
        <Link href='/'>
          <Button size='2' className='mt-4 cursor-pointer'>Voltar para a home</Button>
        </Link>
      </div>
    </Flex>
  )
}
