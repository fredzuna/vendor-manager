export enum TypeErrorEnum {
    Error,
    Success,
  }

export interface IAlert {
    message: string;
    type: TypeErrorEnum
}
export function Alert({message, type}: IAlert) {

    const styleColor = type === TypeErrorEnum.Success ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'

    return (
        <p className= {`h-14 rounded-lg flex items-center justify-center ${styleColor}`} >
            <span>{message}</span>
        </p>
    )
}