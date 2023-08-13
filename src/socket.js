import { io } from 'socket.io-client'

const socket = io('http://localhost:5000/', { autoConnect: false })

export function sendMessage(message) {
	socket.emit('message', message)
}

export default socket
