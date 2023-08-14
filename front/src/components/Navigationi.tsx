import Link from "next/link";

export function Navigation() {
    return (
        <>
            <p><Link className="underline text-blue-600" href="/">Agreements</Link></p>
            <p><Link className="underline text-blue-600" href="/submissions/unpaid">Submissions Unpaid</Link></p>
            <p><Link className="underline text-blue-600" href="/accounts">Deposit money</Link></p>
            <p><Link className="underline text-blue-600" href="/admin">Admin</Link></p>
        </>
    )
}