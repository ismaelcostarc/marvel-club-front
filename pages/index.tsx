import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

export async function getServerSideProps(context: any) {
  return {
    redirect: {
      permanent: false,
      destination: "/login",
    },
    props: {},
  };
}

export default function Home() {
  return (
    <>
    </>
  )
}
