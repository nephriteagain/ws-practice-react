

import { useEffect, useReducer } from 'react'




import Lobby from './components/Lobby'
import LobbyHeader from './components/LobbyHeader'
import Box from './components/Box'
import ConnectingModal from './components/ConnectingModal'
import DisconnectToast from './components/DisconnectToast'
import QuitToast from './components/QuitToast'

import { createLobby, quitGame } from './utils/helper'

import {
  lobbyValue,
  gameBox,
  reducerType,
  actions
} from './types/types'

import reducer from './reducer/reducer'

export const initialGame : gameBox[] = ['', '', '', '', '', '', '', '', '']

// always remember to fix this before shipping
const URL = import.meta.env.VITE_WS_DEV
export const ws = new WebSocket(URL)

export const initialState : reducerType = {
  isConnected: false,
  clientId: null,
  openLobbies: {},
  joinedLobbyId: null,
  gameData: initialGame,
  gameStart: false,
  playerTurn: '',
  players: null,
  score: null
}

// todo refactor this abomination
function App() {
  const [ gameReducer, dispatch ] = useReducer(reducer, initialState)

  const {
    isConnected,
    clientId,
    openLobbies, 
    joinedLobbyId, 
    gameData,    
    gameStart, 
    playerTurn, 
    players, 
    score
  } = gameReducer


  useEffect(() => {
    console.log("NOTE: backend is hosted in a free tier service, cold start might take a while")    

    
    ws.onmessage = message => {
      const response = {...JSON.parse(message.data)}
      console.log(response)

      if (response.type === 'connect') {
        console.log('connected')
        const clientId = response.payload.clientId
        dispatch({type: actions.connect, payload: {
          clientId
        }})
      }
      if (response.type === 'lobby') {        
        const payload = response.payload           
        dispatch({type: actions.lobby, payload: payload})
      }
      if (response.type === 'start') {
        const {game, score, turn, players} = response.payload        
        // console.log(payload)
        dispatch({type: actions.start, payload: {
          game, score, turn, players
        }})
      }
      if (response.type === 'game') {
        const { players, turn, game, score } = response.payload
        // console.log(response.payload)
        const isNewGame = game.every((box:string)=> {
          return box === ''
        })
        if (isNewGame) {
          const timeout = setTimeout(() => {
            dispatch({type: actions.game, payload: {
              players, turn, game, score
            }})
            clearTimeout(timeout)
          },500)
        } else {
          dispatch({type: actions.game, payload: {
            players, turn, game, score
          }})
        }
      }

      if (response.type === 'quit' || response.type === 'disconnect') {
        const { message } = response.payload
        console.log(message)
        if (response.type === 'quit') {
          const element = document.querySelector('.quit-toast') as HTMLDivElement
          element.style.bottom = '3rem'
          const timeout = setTimeout(() => {
            element.style.bottom = '-10%'
            dispatch({type: actions.quit, payload: {}})
            clearTimeout(timeout)
          }, 2000)
        }
        if (response.type === 'disconnect') {
          const element = document.querySelector('.disconnect-toast') as HTMLDivElement
          element.style.bottom = '3rem'
          const timeout = setTimeout(() => {
            element.style.bottom = '-10%'
            dispatch({type: actions.quit, payload: {}})
            clearTimeout(timeout)
          }, 2000)
        }
      }

    }

  

  }, [])

    useEffect(() => {
      if (playerTurn === '') document.title = 'websocket tictactoe'
      else if (playerTurn === clientId) document.title = 'your turn'
      else if (playerTurn !== clientId) document.title = "opponent's turn"
    }, [playerTurn])



  const openLobbyArray = Object.entries(openLobbies)


  return (
    <>
      { !isConnected && <ConnectingModal isConnected={isConnected} />}
      <div className='my-8 font-bold text-3xl text-center'>
        Websocket Tictactoe
      </div>
      {clientId && 
      <div className='relative client-id mx-auto text-center font-semibold w-fit h-fit px-5 py-2 bg-blue-300 rounded-md border border-gray-400 shadow-sm drop-shadow-md mb-8'>
        {clientId}
      </div>}
      <div className='w-fit h-fit mx-auto border-4 border-blue-300 rounded-lg px-3 py-3 shadow-md drop-shadow-md'>
        <LobbyHeader 
          clientId={clientId}
          isConnected={isConnected}
        />
        
        <div className='h-[350px] min-w-[300px] max-w-[350px] bg-gray-400 px-2 py-2 rounded-lg shadow-md drop-shadow-lg overflow-y-scroll overflow-x-visible'>
          {openLobbyArray.map(([key ,value]: [string, lobbyValue]) => {
            const { host, guest } = value
            return (
              <Lobby 
                key={key}
                host={host}
                guest={guest}
                clientId={clientId}
                joinedLobbyId={joinedLobbyId}
                dispatch={dispatch}
              />
            )
          })} 
        </div>
      </div>
        {/* game board */}
    { gameStart &&
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
                  box={box}
                  index={index}
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
    }
    </>
  )
}

export default App
