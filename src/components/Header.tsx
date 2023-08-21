import { clientId } from "../types/types"

interface HeaderProps {
    clientId: clientId
}

export default function Header({clientId}: HeaderProps) {
    return (
        <>
            <div className='my-8 font-bold text-3xl text-center'>
                Websocket Tictactoe
            </div>
            {clientId && 
            <div className='relative client-id mx-auto text-center font-semibold w-fit h-fit px-5 py-2 bg-blue-300 rounded-md border border-gray-400 shadow-sm drop-shadow-md mb-8'>
                {clientId}
            </div>}
        </>
    )
}