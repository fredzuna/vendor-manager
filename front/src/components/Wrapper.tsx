import { Inter } from 'next/font/google'
import { ReactNode } from "react"
const inter = Inter({ subsets: ['latin'] })

interface IWrapper {
    children: ReactNode
}

export function Wrapper({ children }: IWrapper) {
    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
        >
          <div className='w-full'>{children}</div>
        </main>
    )
}