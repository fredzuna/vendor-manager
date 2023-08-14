export type Agreement = {
    id: string
    terms: number,
    status: string,
    SupplierId: string,
    BuyerId: string,
    Supplier: Account,
    Buyer: Account,
  }

  export type Account = {
    id: string,
    firstName: string,
    lastName: string,
    balance: number
    profession: string,
    type: string,
}