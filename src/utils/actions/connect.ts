import { action, reducerType, clientId } from '../../types/types';
export default function connect(state: reducerType, action: action) { 
    const clientId = action.payload?.clientId as clientId;

    return {
        ...state,        
        clientId: clientId,
        isConnected: true        
    }
}