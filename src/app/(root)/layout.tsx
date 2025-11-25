import { Header } from '@/components/layout/header';
import React from 'react'

const BaseLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
    <Header />
    <main className='w-4/5 m-auto'>
        {children}
    </main>
    </>
  )
}


export default BaseLayout
