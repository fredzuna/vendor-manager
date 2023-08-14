import { Inter } from 'next/font/google'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { Wrapper } from '@/components/Wrapper'
import { Agreement } from '@/models'
import { Navigation } from '@/components/Navigationi'

const inter = Inter({ subsets: ['latin'] })

interface IHome {
  agreements: Agreement[]
}

export default function Home(props: IHome) {
  const { agreements } = props  
  return (
    <Wrapper>
        <Navigation/>
        <table className="border-collapse border border-slate-400 w-full">
          <caption className="caption-top text-2xl">            
            Agreements
          </caption>
          <thead>
            <tr>
              <th className="border border-slate-300">Id</th>
              <th className="border border-slate-300">Status</th>
              <th className="border border-slate-300">Terms</th>
              <th className="border border-slate-300">Buyer</th>
              <th className="border border-slate-300">Supplier</th>
            </tr>
          </thead>
          <tbody>
            {agreements.map(item => (
              <tr key={item.id}>
                <td className="border border-slate-300">{item.id}</td>
                <td className="border border-slate-300">{item.status}</td>
                <td className="border border-slate-300">{item.terms}</td>
                <td className="border border-slate-300">{item.Buyer.firstName} {item.Buyer.lastName}</td>
                <td className="border border-slate-300">{item.Supplier.firstName} {item.Supplier.lastName}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps<{
  agreements: Agreement
}> = async () => {
  const res = await fetch('http://localhost:3001/agreements')
  const agreements = await res.json()
  return { props: { agreements } }
}