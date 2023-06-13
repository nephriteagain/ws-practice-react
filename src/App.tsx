

import { useState, useEffect, useRef } from 'react'


import { FaRegCircle } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'

interface lobbyValue {
  host: string
  guest: string
}

type score = {
  host: number
  guest: number
}

type lobbyObj = Record<string,lobbyValue>

type gameBox = 'x'|''|'o'
type gameDataType = gameBox[]

const initialGame : gameBox[] = ['', '', '', '', '', '', '', '', '']

function App() {
  const [ clientId, setClientId ] = useState<string|null>(null)
  const [ openLobbies, setOpenLobbies ] = useState<lobbyObj>({})
  const [ joinedLobbyId, setJoinedLobbyId ] = useState<string|null>(null)

  const [ gameData, setGameData ] = useState<gameDataType>(initialGame)
  const [ gameStart, setGameStart ] = useState<boolean>(false)
  const [ playerTurn, setPlayerTurn ] = useState<string>('')
  const [ players, setPlayers ] = useState<lobbyValue|null>(null)
  const [ score, setScore ] = useState<score|null>(null)

  const btnRef = useRef<HTMLButtonElement>(null)
  
  const ws = new WebSocket("ws:localhost:8999")

  function createLobby() {
    const data = {type: 'create', id: clientId}
    const payload = JSON.stringify(data)
    ws.send(payload)
  }

  function deleteLobby() {
    const data = {type: 'delete', id: clientId}
    const payload = JSON.stringify(data)
    ws.send(payload)
  }

  function joinLobby(lobbyId: string) {
    if (joinedLobbyId && joinedLobbyId !== lobbyId) {
      leaveLobby(joinedLobbyId)
    }

    const data = {type: 'join', id: clientId, lobbyId}
    const payload = JSON.stringify(data)
    ws.send(payload)
    setJoinedLobbyId(lobbyId)
  }

  function leaveLobby(lobbyId: string) {
    const data = {type: 'leave', lobbyId}
    const payload = JSON.stringify(data)
    ws.send(payload)
    setJoinedLobbyId(null)
  }

  function move(box: string, index: number) {
    if (playerTurn !== clientId) return
    if (box !== '') return
    if (players === null) return
    const yourMove = players.host === clientId ? 'x' : 'o'
    const nextTurn = playerTurn === players.host ? players.guest : players.host
    const newGameData = gameData.map((box, i) => {
      if (i === index) {
        return yourMove
      }
      return box
    })
    const data = {
      type: 'game', 
      gameId: players.host, 
      playerId: clientId, 
      nextTurn,
      gameData: newGameData
    }
    const payload = JSON.stringify(data)
    ws.send(payload)
  }

  function quitGame() {
    if (players === null) return
    const data = {type: 'quit', gameId: players.host, players}
    const payload = JSON.stringify(data)
    ws.send(payload)
  }

  useEffect(() => {
    ws.onmessage = message => {
      const response = {...JSON.parse(message.data)}
      // console.log(response)

      if (response.type === 'connect') {
        console.log('connected')
        setClientId(response.payload.clientId)
      }
      if (response.type === 'lobby') {        
        const payload = response.payload           
        setOpenLobbies(payload)                
      }
      if (response.type === 'start') {
        const payload = response.payload        
        console.log(payload)
        setJoinedLobbyId(null)
        setGameData(payload.game)
        setScore(payload.score)
        setGameStart(true)
        setPlayerTurn(payload.turn)
        setPlayers(payload.players)
      }
      if (response.type === 'game') {
        const { players, turn, game, score } = response.payload
        console.log(response.payload)
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

      if (response.type === 'quit') {
        const { message } = response.payload
        setGameData(initialGame)
        setGameStart(false)
        setPlayerTurn('')
        setPlayers(null)
        setScore(null)

        alert(message)
      }

    }

  }, [])

  useEffect(() => {
    console.log(joinedLobbyId, 'joined lobby id')
  }, [joinedLobbyId])  


  const openLobbyArray = Object.entries(openLobbies)

  return (
    <>
      <div className='my-8 font-bold text-3xl text-center'>
        Websocket Tictactoe
      </div>
      {clientId && 
      <div className='relative client-id mx-auto text-center font-semibold w-fit h-fit px-5 py-2 bg-blue-300 rounded-md border border-gray-400 shadow-sm drop-shadow-md mb-8'>
        {clientId}
      </div>}
      <div className='w-fit h-fit mx-auto border-4 border-blue-300 rounded-lg px-3 py-3 shadow-md drop-shadow-md'>
        <div className='flex flex-row items-center justify-center mb-3'>
          <button className='me-auto create bg-green-400 px-3 py-1 drop-shadow-md shadow-md rounded-md font-semibold hover:scale-105 active:100 transition-all duration-200 disabled:opacity-70'
            onClick={createLobby} 
            ref={btnRef}
          >
            Create Lobby
          </button>
          <p className='font-semibold text-gray-500'>
          open lobbies
          </p>
          </div>
        
        <div className='h-[350px] min-w-[350px] bg-gray-400 px-2 py-2 rounded-lg shadow-md drop-shadow-lg overflow-y-scroll overflow-x-visible'>
          {openLobbyArray.map(([key ,value]: [string, lobbyValue]) => {
            const { host, guest } = value
            return (
              <div className='flex flex-row max-w-[400px] min-w-[320px] text-sm my-2 rounded-md hover:scale-110 transition-all duration-200 z-[2]'
                key={key}
              >
                <div className='basis-1/3 bg-gray-300 text-center px-3 py-1'>
                  {host}
                </div>
                <div className='basis-1/3 bg-stone-300 text-center px-3 py-1'>
                  {guest}
                </div>
                <div className='basis-1/3 bg-slate-300 text-center px-3 py-1'>
                  { guest.length === 0 && host !== clientId &&
                  <button className='bg-green-300 px-2 py-[0.1rem] text-sm rounded-md shadow-md drop-shadow-md hover:scale-x-105 active:scale-90 hover:bg-green-400 transition-all duration-200'
                    onClick={() => joinLobby(host)}
                  >
                    join
                  </button>}
                  { host === clientId &&
                  <button className='bg-red-300 px-2 py-[0.1rem] text-sm rounded-md shadow-md drop-shadow-md hover:scale-x-105 active:scale-90 hover:bg-red-400 transition-all duration-200'
                    onClick={deleteLobby}
                  >
                    delete
                  </button>}
                  { guest === clientId  &&
                  <button className='bg-orange-300 px-2 py-[0.1rem] text-sm rounded-md shadow-md drop-shadow-md hover:scale-x-105 active:scale-90 hover:bg-orange-400 transition-all duration-200'
                    onClick={() => leaveLobby(host)}
                  >
                    leave
                  </button>}
                </div>
              </div>
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
                <div key={index}
                className='odd:bg-[#fcfcfc] even:bg-zinc-400 w-[100px] aspect-square even:shadow-lg even:drop-shadow-lg'
                onClick={() => move(box, index)}
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
            })}
          </div>
      </div>
      <button className='px-3 py-[0.1rem] absolute sm:top-4 top-20 right-4 bg-red-200 border-2 border-red-500 rounded-md shadow-md drop-shadow-md  hover:bg-red-700 hover:border-red-900 hover:text-white active:scale-90 transition-all duration-200'
        onClick={quitGame}
      >
        Leave Game
      </button>
    </div>
    }
    </>
  )
}

export default App