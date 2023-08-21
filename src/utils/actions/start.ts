import { reducerType, action } from "../../types/types";

export default function start(state: reducerType, action: action) : reducerType {
    const game = action.payload.game;
    const score = action.payload.score;
    const turn =  action.payload.turn;
    const players = action.payload.players

    return {
        ...state,
        joinedLobbyId: null,
        gameStart: true,
        gameData: game,
        score: score,
        playerTurn: turn,
        players: players
    }
}