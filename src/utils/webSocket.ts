import { Dispatch } from "react"
import { action, actions } from "../types/types"

export default function connectToWebSocket(ws: WebSocket, dispatch: Dispatch<action>) {
    ws.onmessage = message => {
        const response = {...JSON.parse(message.data)}
        console.log(response)
  
        if (response.type === 'connect') {
          console.log('connected')
          const clientId = response.payload.clientId
          dispatch({type: actions.connect, payload: {
            clientId
          }})
        }
        if (response.type === 'lobby') {        
          const payload = response.payload           
          dispatch({type: actions.lobby, payload: payload})
        }
        if (response.type === 'start') {
          const {game, score, turn, players} = response.payload        
          // console.log(payload)
          dispatch({type: actions.start, payload: {
            game, score, turn, players
          }})
        }
        if (response.type === 'game') {
          const { players, turn, game, score } = response.payload
          // console.log(response.payload)
          const isNewGame = game.every((box:string)=> {
            return box === ''
          })
          if (isNewGame) {
            const timeout = setTimeout(() => {
              dispatch({type: actions.game, payload: {
                players, turn, game, score
              }})
              clearTimeout(timeout)
            },500)
          } else {
            dispatch({type: actions.game, payload: {
              players, turn, game, score
            }})
          }
        }
  
        if (response.type === 'quit' || response.type === 'disconnect') {
          const { message } = response.payload
          console.log(message)
          if (response.type === 'quit') {
            const element = document.querySelector('.quit-toast') as HTMLDivElement
            element.style.bottom = '3rem'
            const timeout = setTimeout(() => {
              element.style.bottom = '-10%'
              dispatch({type: actions.quit, payload: {}})
              clearTimeout(timeout)
            }, 2000)
          }
          if (response.type === 'disconnect') {
            const element = document.querySelector('.disconnect-toast') as HTMLDivElement
            element.style.bottom = '3rem'
            const timeout = setTimeout(() => {
              element.style.bottom = '-10%'
              dispatch({type: actions.quit, payload: {}})
              clearTimeout(timeout)
            }, 2000)
          }
        }
  
      }
}