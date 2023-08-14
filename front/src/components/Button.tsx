export interface IButton {
    text: string
    handleButton: VoidFunction
}
export  function Button(props: IButton) {
    const { text, handleButton } = props;
    return <button onClick={handleButton} className="py-2 px-3 bg-indigo-500 text-white text-sm font-semibold rounded-md shadow focus:outline-none ">{text}</button>
}