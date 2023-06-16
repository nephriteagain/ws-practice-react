

import { useState, useEffect } from 'react'



import DisconnectToast from './components/DisconnectToast'
import QuitToast from './components/QuitToast'
import Lobby from './components/Lobby'
import Box from './components/Box'

import {
  createLobby,
  quitGame,
} from './utils/helper'
import ConnectingModal from './components/ConnectingModal'

export type clientId = string|null
export type lobbyId = string|null

export interface lobbyValue {
  host: string
  guest: string
}

export type score = {
  host: number
  guest: number
}

export type lobbyObj = Record<string,lobbyValue>

export type gameBox = 'x'|''|'o'
export type gameDataType = gameBox[]

const initialGame : gameBox[] = ['', '', '', '', '', '', '', '', '']


export const ws = new WebSocket(import.meta.env.VITE_WS)

function App() {
  const [  isConnected, setIsConnected ] = useState<boolean>(false)
  const [ clientId, setClientId ] = useState<clientId>(null)
  const [ openLobbies, setOpenLobbies ] = useState<lobbyObj>({})
  const [ joinedLobbyId, setJoinedLobbyId ] = useState<lobbyId>(null)

  const [ gameData, setGameData ] = useState<gameDataType>(initialGame)
  const [ gameStart, setGameStart ] = useState<boolean>(false)
  const [ playerTurn, setPlayerTurn ] = useState<string>('')
  const [ players, setPlayers ] = useState<lobbyValue|null>(null)
  const [ score, setScore ] = useState<score|null>(null)



  useEffect(() => {
    ws.onmessage = message => {
      const response = {...JSON.parse(message.data)}
      // console.log(response)

      if (response.type === 'connect') {
        console.log('connected')
        setClientId(response.payload.clientId)
        setIsConnected(true)
      }
      if (response.type === 'lobby') {        
        const payload = response.payload           
        setOpenLobbies(payload)                
      }
      if (response.type === 'start') {
        const payload = response.payload        
        // console.log(payload)
        setJoinedLobbyId(null)
        setGameData(payload.game)
        setScore(payload.score)
        setGameStart(true)
        setPlayerTurn(payload.turn)
        setPlayers(payload.players)
      }
      if (response.type === 'game') {
        const { players, turn, game, score } = response.payload
        // console.log(response.payload)
        const isNewGame = game.every((box:string)=> {
          return box === ''
        })
        if (isNewGame) {
          const timeout = setTimeout(() => {
            setPlayers(players)
            setPlayerTurn(turn)
            setGameData(game)
            setScore(score)
            clearTimeout(timeout)
          },500)
        } else {
          setPlayers(players)
          setPlayerTurn(turn)
          setGameData(game)
          setScore(score)
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
            setGameData(initialGame)
            setGameStart(false)
            setPlayerTurn('')
            setPlayers(null)
            setScore(null)
            clearTimeout(timeout)
          }, 2000)
        }
        if (response.type === 'disconnect') {
          const element = document.querySelector('.disconnect-toast') as HTMLDivElement
          element.style.bottom = '3rem'
          const timeout = setTimeout(() => {
            element.style.bottom = '-10%'
            setGameData(initialGame)
            setGameStart(false)
            setPlayerTurn('')
            setPlayers(null)
            setScore(null)
            clearTimeout(timeout)
          }, 2000)
        }
      }

    }

  

  }, [])



  const openLobbyArray = Object.entries(openLobbies)

  return (
    <>
      { !isConnected && <ConnectingModal />}
      <div className='my-8 font-bold text-3xl text-center'>
        Websocket Tictactoe
      </div>
      {clientId && 
      <div className='relative client-id mx-auto text-center font-semibold w-fit h-fit px-5 py-2 bg-blue-300 rounded-md border border-gray-400 shadow-sm drop-shadow-md mb-8'>
        {clientId}
      </div>}
      <div className='w-fit h-fit mx-auto border-4 border-blue-300 rounded-lg px-3 py-3 shadow-md drop-shadow-md'>
        <div className='flex flex-row items-center justify-center mb-3'>
          <button className='me-auto create bg-green-400 px-3 py-1 drop-shadow-md shadow-md rounded-md font-semibold hover:scale-105 active:100 transition-all duration-200 disabled:opacity-70 disabled:hover:scale-100'
            onClick={() => createLobby(clientId)} 
            disabled={!isConnected}
          >
            Create Lobby
          </button>
          <p className='font-semibold text-gray-500'>
          open lobbies
          </p>
          </div>
        
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
                setJoinedLobbyId={setJoinedLobbyId}
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
            HOST: {score.host}
          </div>
          <div className='font-semibold text-xl bg-red-400 px-4 py-1 rounded-md shadow-md drop-shadow-md'>
            GUEST: {score.guest}
          </div>          
        </div>
        }
        <div className={
          clientId === players?.host ? 
          'mb-1 w-fit h-fit mx-auto px-6 py-1 shadow-md drop-shadow-md rounded-md font-bold text-2xl bg-blue-300' :
          'mb-1 w-fit h-fit mx-auto px-6 py-1 shadow-md drop-shadow-md rounded-md font-bold text-2xl bg-red-300'
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
