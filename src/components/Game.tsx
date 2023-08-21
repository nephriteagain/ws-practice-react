import Box from "./Box"
import DisconnectToast from "./DisconnectToast"
import QuitToast from "./QuitToast"

import { clientId, score, lobbyValue, gameBox} from "../types/types"
import { quitGame } from "../utils/helper"

interface GameProps {
    clientId: clientId;
    score: score|null;
    players: lobbyValue|null;
    playerTurn: string;
    gameData: gameBox[];
}   

export default function Game({clientId, score, players, playerTurn, gameData,}: GameProps) {
    return (
        <div className='absolute top-0 left-0 w-full h-full z-[1000] bg-[#dcdcdc]'>
      <div className='my-8 font-bold text-3xl text-center'>
        Websocket Tictactoe
      </div>
      {clientId && 
      <div className='relative client-id mx-auto text-center font-semibold w-fit h-fit px-5 py-2 bg-blue-300 rounded-md border border-gray-400 shadow-sm drop-shadow-md mb-8'>
        {clientId}
      </div>}
      <div className='mt-10'>
        {score &&
        <div className='mx-auto mb-2   flex flex-row items-center justify-center min-w-[300px] w-fit h-fit gap-14'>          
          <div className='font-semibold text-xl bg-blue-400 px-4 py-1 rounded-md shadow-md drop-shadow-md'>
            HOST:
            <span className='ms-1 font-bold'>
              {score.host}
            </span>
          </div>
          <div className='font-semibold text-xl bg-red-400 px-4 py-1 rounded-md shadow-md drop-shadow-md'>
            GUEST:
            <span className='ms-1 font-bold'>
              {score.guest}
            </span>
          </div>          
        </div>
        }
        <div className={
          clientId === players?.host ? 
          'mb-1 w-fit h-fit mx-auto px-6 py-1 shadow-md drop-shadow-md rounded-md font-bold text-2xl bg-blue-300 transition' :
          'mb-1 w-fit h-fit mx-auto px-6 py-1 shadow-md drop-shadow-md rounded-md font-bold text-2xl bg-red-300 transition'
        }
        >
          {playerTurn.length > 0 && playerTurn === clientId ? 'Your Turn' : "Opponent's Turn"}
        </div>
        <div className='grid grid-cols-3 w-fit h-fit mx-auto mt-2 mb-4 min-w-[300px] shadow-lg drop-shadow-lg'>
            {gameData.map((box, index) => {
              return (
                <Box 
                  key={index}
                  index={index}
                  box={box}
                  playerTurn={playerTurn}
                  clientId={clientId}
                  players={players}
                  gameData={gameData}
                />
              )
            })}
          </div>
      </div>
      <button className='px-3 py-[0.1rem] absolute sm:top-4 top-20 right-4 bg-red-200 border-2 border-red-500 rounded-md shadow-md drop-shadow-md  hover:bg-red-700 hover:border-red-900 hover:text-white active:scale-90 transition-all duration-200'
        onClick={() => quitGame(clientId, players)}
      >
        Leave Game
      </button>
      <DisconnectToast />
      <QuitToast />
    </div>
    )
}