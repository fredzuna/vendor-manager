import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { useState } from 'react'
import { Button } from '@/components/Button'
import { Wrapper } from '@/components/Wrapper'
import { Alert, IAlert, TypeErrorEnum } from '@/components/Alert';
import { Navigation } from '@/components/Navigationi';


type Submission = {
    id: string,
    description: string,
    price: number,
    paid: boolean,
    paymentDate: Date,
    Agreement: {
        status: string;
        Buyer: {
            firstName: string,
            lastName: string,
            balance: number
        }
    }
}

interface IUnpaid {
    submissions: Submission[]
}

interface IMessage {
    message: string
}

export default function Unpaid(props: IUnpaid) {
    const [alert, setAlert] = useState<IAlert>()
  const router = useRouter();
  const { submissions } = props;  

  const refreshData = () => {
    router.replace(router.asPath);
  }

  const handlePayment = async (item: Submission) => {
        try {
            setAlert({})
            const res= await fetch(`http://localhost:3001/submissions/${item.id}/pay`, {
                method: "POST",
                headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            const response: IMessage = await res.json();

            if(res.status === 200) {
                setAlert({ message: response.message, type: TypeErrorEnum.Success})
            }else {
                setAlert({ message: response.message, type: TypeErrorEnum.Error})
            }

            refreshData()
        } catch (error) {
            console.log(error);
        }
  }

  return (
    <Wrapper>
            <Navigation/>
            {alert && 
                <Alert message={alert.message} type={alert.type}/>
            }
            <table className="border-collapse border border-slate-400 w-full">
            <caption className="caption-top text-2xl">
                Submissions Unpaid
            </caption>
            <thead>
                <tr>
                <th className="border border-slate-300">Id</th>
                <th className="border border-slate-300">Description</th>
                <th className="border border-slate-300">Price</th>
                <th className="border border-slate-300">Buyer</th>
                <th className="border border-slate-300">Balance</th>
                <th className="border border-slate-300">Action</th>
                </tr>
            </thead>
            <tbody>
                {submissions.map(item => {
                    const { Buyer } = item.Agreement;
                    const fullName =  `${Buyer.firstName} ${Buyer.lastName}`
                    return (
                        <tr key={item.id}>
                            <td className="border border-slate-300">{item.id}</td>
                            <td className="border border-slate-300">{item.description}</td>
                            <td className="border border-slate-300">{item.price}</td>
                            <td className="border border-slate-300">{fullName}</td>
                            <td className="border border-slate-300">{item.Agreement.Buyer.balance}</td>
                            <td className="border border-slate-300">
                                <Button text='Pay Submission' handleButton={() => {
                                    handlePayment(item)
                                }} />
                            </td>
                        </tr>
                    )
                })}
            </tbody>
            </table>
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps<{
    submissions: Submission[]
}> = async () => {
  const res = await fetch('http://localhost:3001/submissions/unpaid')
  const submissions = await res.json()
  return { props: { submissions } }
}