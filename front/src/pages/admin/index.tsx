import { Navigation } from '@/components/Navigationi'
import { Wrapper } from '@/components/Wrapper'
import { Account } from '@/models'
import { useEffect, useState } from 'react'

export default function Admin() {
  const [bestProfession, setBestProfession] = useState<string>()
  const [bestBuyer, setBestBuyer] = useState<Account[]>([])

  const [startDate, setStartDate] = useState<string>("2022-04-17")
  const [endDate, setEndDate] = useState<string>("2022-04-29")

  const fetchBestProfession = async () => {
    if(endDate && startDate) {
        const res = await fetch(`http://localhost:3001/admin/best-supplier-profession?start=${startDate}&end=${endDate}`)
        const result = await res.json()
        setBestProfession(result.profession)
        console.log(result)
    }
  }

  const fetchBestBuyer = async () => {
    if(endDate && startDate) {
        const res = await fetch(`http://localhost:3001/admin/best-buyers?start=${startDate}&end=${endDate}`)
        const result = await res.json()
        setBestBuyer(result)
        console.log(result)
    }
  }

  useEffect(() => {
    fetchBestProfession()
    fetchBestBuyer()
  }, [startDate, endDate])

  return (
    <Wrapper>
        <Navigation/>
        <div>
            <label htmlFor="startDate">Start date:</label>
            <input type="date" id="start" name="startDate" value={startDate}
                onChange={(e) => {
                    const value = e.target.value;
                    setStartDate(value)
                }}
            />
            &nbsp;&nbsp;   
            <label htmlFor="endDate">End date:</label>
            <input type="date" id="end" name="endDate" value={endDate}
                onChange={(e) => {
                    const value = e.target.value;
                    setEndDate(value)
                }}
            />
        </div>
        
        <table className="border-collapse border border-slate-400 w-full">
        <thead>
            <tr>
                <th className="border border-slate-300">Best profession</th>
                <th className="border border-slate-300">Best buyer</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td className="border border-slate-300">{bestProfession}</td>
                <td className="border border-slate-300">
                    <ul>
                        {bestBuyer.map((item) => {
                            const fullName = `${item.firstName} ${item.lastName}`
                            return(
                                <li key={item.id}>Name: {fullName}, Balance: {item.balance}</li>                            
                            )
                        })}
                        
                    </ul>
                </td>
            </tr>
        </tbody>
        </table>
    </Wrapper>
  )
}