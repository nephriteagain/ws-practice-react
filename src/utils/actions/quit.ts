import { reducerType } from './../../types/types';

import { initialGame } from '../../App';

export default function quit(state: reducerType) : reducerType {
    return {
        ...state,
        gameData: initialGame,
        gameStart: false,
        playerTurn: '',
        players: null,
        score: null
    }
}