import { reducerType, action } from "../../types/types";

export default function lobby(state: reducerType, action: action) : reducerType {
    const payload = action.payload;
    return {
        ...state,
        openLobbies: payload
    }
}