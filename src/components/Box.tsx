import { FaRegCircle } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'

import { move } from '../utils/helper'

import type { clientId, gameDataType, lobbyValue } from '../App'

interface BoxProps {
  box: string
  index: number
  playerTurn: string,
  clientId: clientId
  players: lobbyValue|null
  gameData: gameDataType
}

export default function Box({
  box,
  index,
  playerTurn,
  clientId,
  players,
  gameData,
} : BoxProps) {
  return (
    <div
    className='odd:bg-[#fcfcfc] even:bg-zinc-400 w-[100px] aspect-square even:shadow-lg even:drop-shadow-lg'
    onClick={() => move(box, index, playerTurn, clientId, players, gameData)}
    >
      <div className="w-full h-full text-7xl flex items-center justify-center">
        {box === 'x' ? 
        <IoMdClose className="fill-blue-600 scale-[1.3]" /> : 
        box === 'o' ? 
        <FaRegCircle className="fill-red-600" /> : 
        ''}
      </div>
    </div>
  )
}
