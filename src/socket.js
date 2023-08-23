import { io } from 'socket.io-client'

const socket = io(process.env.REACT_APP_BASE_URL, { autoConnect: false })

export function sendMessage(message) {
	socket.emit('message', message)
}

export default socket
