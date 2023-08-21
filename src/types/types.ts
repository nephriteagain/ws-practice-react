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

export interface reducerType {
    isConnected: boolean;
    clientId: clientId;
    openLobbies: lobbyObj;
    joinedLobbyId: lobbyId
    gameData: gameBox[];
    gameStart: boolean;
    playerTurn: string;
    players: lobbyValue|null;
    score: score|null;
}

export interface action {
    type: string,
    payload: Record<string,any>
}

export enum actions {
    connect = 'connect',
    lobby = 'lobby',
    start = 'start',
    game = 'game',
    quit = 'quit',
    leaveLobby = 'leave_lobby',
    joinLobby = 'join_lobby'
}