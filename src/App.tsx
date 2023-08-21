

import { useEffect, useReducer } from 'react'

import connectToWebSocket from './utils/webSocket'
import { changeDocumentTitleWhenOnGame } from './utils/helper'

import Lobby from './components/Lobby'
import LobbyHeader from './components/LobbyHeader'
import Header from './components/Header'
import Game from './components/Game'
import ConnectingModal from './components/ConnectingModal'



import {
  lobbyValue,
  gameBox,
  reducerType,
} from './types/types'

import reducer from './reducer/reducer'

export const initialGame : gameBox[] = ['', '', '', '', '', '', '', '', '']

// always remember to fix this before shipping
const URL = import.meta.env.VITE_WS
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
    connectToWebSocket(ws, dispatch)

  }, [])

  useEffect(() => {
    changeDocumentTitleWhenOnGame(playerTurn, clientId)
  }, [playerTurn])



  const openLobbyArray = Object.entries(openLobbies)


  return (
    <>
      { !isConnected && <ConnectingModal isConnected={isConnected} />}
      <Header clientId={clientId} />
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
    { 
      gameStart && 
      <Game 
        clientId={clientId}
        score={score}
        players={players}
        playerTurn={playerTurn}
        gameData={gameData}      
      />
    }
    </>
  )
}

export default App
