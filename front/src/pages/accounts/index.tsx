import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { useState } from 'react'
import { Alert, IAlert, TypeErrorEnum } from '@/components/Alert';
import { Wrapper } from '@/components/Wrapper';
import { Account } from '@/models';
import { Button } from '@/components/Button';
import { Navigation } from '@/components/Navigationi';



interface IAccounts {
    accounts: Account[]
}


export default function Accounts(props: IAccounts) {
  const [alert, setAlert] = useState<IAlert>()
  const router = useRouter();
  const { accounts } = props;

  const refreshData = () => {
    router.replace(router.asPath);
  }

  return (
    <Wrapper>
        <Navigation/>
        {alert && 
            <Alert message={alert.message} type={alert.type}/>
        }
        <table className="border-collapse border border-slate-400 w-full">
        <caption className="caption-top text-2xl">
            Buyer make deposit
        </caption>
        <thead>
            <tr>
            <th className="border border-slate-300">Id</th>
            <th className="border border-slate-300">Name</th>
            <th className="border border-slate-300">profession</th>
            <th className="border border-slate-300">balance</th>
            <th className="border border-slate-300">type</th>
            <th className="border border-slate-300">Action</th>
            </tr>
        </thead>
        <tbody>
            {accounts.map(item => {
                const fullName =  `${item.firstName} ${item.lastName}`
                return (
                    <tr key={item.id}>
                        <td className="border border-slate-300">{item.id}</td>
                        <td className="border border-slate-300">{fullName}</td>
                        <td className="border border-slate-300">{item.profession}</td>
                        <td className="border border-slate-300">{item.balance}</td>
                        <td className="border border-slate-300">{item.type}</td>
                        <td className="border border-slate-300">
                            {item.type === 'buyer' && 
                                <DepositForm account={item} setAlert={setAlert} refreshData={refreshData}/>
                            }
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
    accounts: Account[]
}> = async () => {
  const res = await fetch('http://localhost:3001/agreements/user/accounts')
  const accounts = await res.json()
  return { props: { accounts } }
}

interface IDepositForm {
    account: Account,
    setAlert: (alert?: IAlert) => void,
    refreshData: VoidFunction
}
function DepositForm(props: IDepositForm) {
    const { account, setAlert, refreshData } = props;
    const [openDepositForm, setOpenDepositForm] = useState<boolean>(false)
    const [amount, setAmount] = useState<number>()

    const handleClose = () => {
        setOpenDepositForm(false)
    }

    const handleDeposit = async () => {
        if(!amount) {
            return 
        }

        try {
            setAlert()
            const res= await fetch(`http://localhost:3001/balances/deposit/${account.id}`, {
                method: "POST",
                body: JSON.stringify({ amount }),
                headers: {"Content-type": "application/json; charset=UTF-8"}
            })            

            const response = await res.json();
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
        <>
            {openDepositForm ?
                <div>
                    <input 
                        type="number"
                        value={amount} 
                        onChange={(e) => {
                            const value = e.target.value
                            setAmount(parseInt(value))
                        }}
                    />
                    <Button 
                        text='Deposit' 
                        handleButton={handleDeposit} 
                    />
                    <Button 
                        text='Cancel' 
                        handleButton={handleClose} 
                    />
                </div>
                :            
                <Button 
                    text='Make Deposit' 
                    handleButton={() => {
                        setOpenDepositForm(true)
                    }} 
                />
            }
        </>
    )
}