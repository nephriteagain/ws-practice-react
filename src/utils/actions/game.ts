import { action, reducerType } from "../../types/types";

export default function game(state: reducerType, action: action) : reducerType {
    const {
        players,
        score,
        turn,
        game,
    } = action.payload

    return {
        ...state,
        players,
        score,
        playerTurn: turn,
        gameData: game,

    }
}