import { reducerType, action, actions } from "../types/types";

import connect from "../utils/actions/connect";
import lobby from "../utils/actions/lobby";
import start from "../utils/actions/start";
import game from "../utils/actions/game";
import quit from "../utils/actions/quit";

export default function reducer(state: reducerType, action: action) : reducerType{
    if (action.type === actions.connect) {
        return connect(state, action)
    }
    if (action.type === actions.lobby) {
        return lobby(state, action)
    }
    if (action.type === actions.start) {
        return start(state, action)
    }
    if (action.type === actions.game) {
        return game(state, action)
    }
    if (action.type === actions.quit) {
        return quit(state)
    }
    if (action.type === actions.leaveLobby) {
        return {
            ...state,
            joinedLobbyId: null
        }
    }
    if (action.type === actions.joinLobby) {
        const joinedLobbyId = action.payload.joinedLobbyId as string
        return {
            ...state,
            joinedLobbyId
        }
    }

    // default
    return state
}