'use client'

import { Flex, Skeleton } from '@radix-ui/themes'
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation'
import { Api } from '@/helpers/api';
import Header from '@/components/Header'
import PatientsArea from '@/components/PatientsArea';

export default function LoggedPage({
  children,
  view,
}: {
  children: React.ReactNode;
  view: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    name: '',
    email: '',
  });
  const api = new Api();
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('tkn_teste_isa');
    router.push('/');
  }
  useEffect(() => {
    const token = localStorage.getItem('tkn_teste_isa');
    if (!token) {
      router.push('/');
      return;
    }
    api.get('/user')
      .then((res: any) => {
        setUser(res.data)
        setLoading(false);
      })
      .catch((_) => {
        localStorage.removeItem('tkn_teste_isa');
        router.push('/');
        api.controller.abort();
      });
  }, []);
  if (loading) return <Skeleton height='100vh' />;
  return (
    <Flex direction='column' className='bg-slate-50' height='100vh'>
      <Flex direction='column'>
        <Header user={user} logout={handleLogout} />
        <PatientsArea>
          {children}
        </PatientsArea>
      </Flex>
    </Flex>
  )
}
