import { clientId } from "../types/types"

import { createLobby } from "../utils/helper"

interface LobbyHeaderProps {
    clientId: clientId;
    isConnected: boolean
}

export default function LobbyHeader({clientId, isConnected}: LobbyHeaderProps) {
    return (
        <div className='flex flex-row items-center justify-center mb-3'>
          <button className='me-auto create bg-green-400 px-3 py-1 drop-shadow-md shadow-md rounded-md font-semibold hover:scale-105 active:scale-100 transition-all duration-200 disabled:opacity-70 disabled:hover:scale-100'
            onClick={() => createLobby(clientId)} 
            disabled={!isConnected}
          >
            Create Lobby
          </button>
          <p className='font-semibold text-gray-500'>
          open lobbies
          </p>
          </div>
    )
}