import { Dispatch, SetStateAction } from 'react'
import type { clientId, lobbyId, lobbyValue, gameDataType } from "../App"

import { ws } from '../App'


export function createLobby(
  clientId: clientId,
) {
  if (!clientId) return
  const data = {type: 'create', id: clientId}
  const payload = JSON.stringify(data)
  ws.send(payload)
}

export function deleteLobby(
  clientId: clientId,
) {
  if (!clientId) return
  const data = {type: 'delete', id: clientId}
  const payload = JSON.stringify(data)
  ws.send(payload)
}

export function leaveLobby(
  lobbyId: string,
  clientId: string,
  setJoinedLobbyId: Dispatch<SetStateAction<lobbyId>>,
  ) {
  if (!clientId) return
  const data = {type: 'leave', lobbyId, id: clientId}
  const payload = JSON.stringify(data)
  ws.send(payload)
  setJoinedLobbyId(null)
}

export function joinLobby(
  lobbyId: string,
  clientId: clientId,
  setJoinedLobbyId: Dispatch<SetStateAction<lobbyId>>,
  joinedLobbyId: lobbyId,
  leaveLobby: (
    lobbyId: string,
    clientId: string,
    setJoinedLobbyId: Dispatch<SetStateAction<lobbyId>>
  ) => void
  ) {
  if (!clientId) return
  if (joinedLobbyId && joinedLobbyId !== lobbyId) {
    leaveLobby(joinedLobbyId, clientId, setJoinedLobbyId)
  }

  const data = {type: 'join', id: clientId, lobbyId}
  const payload = JSON.stringify(data)
  ws.send(payload)
  setJoinedLobbyId(lobbyId)
}

export function move(
  box: string, 
  index: number,
  playerTurn: string,
  clientId: clientId,
  players: lobbyValue|null,
  gameData: gameDataType,
  ) {
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
    gameData: newGameData,
    id: clientId
  }
  const payload = JSON.stringify(data)
  ws.send(payload)
}


export function quitGame(
  clientId: clientId,
  players: lobbyValue|null,
) {
  if (players === null || !clientId) return
  const data = {type: 'quit', gameId: players.host, players, id: clientId}
  const payload = JSON.stringify(data)
  ws.send(payload)
}
