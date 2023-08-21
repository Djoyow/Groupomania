import Login from './component/login'
import SingUp from './component/singUp'
import Post from './component/post'
import Error from './component/error'
import Footer from './component/footer'
import Header from './component/header'
import 'bootstrap/dist/css/bootstrap.css'

import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import socket from './socket'

import 'react-toastify/dist/ReactToastify.css'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from './features/userSlice'
import {
	addMessageToConvo,
	selectConvos,
	selectOnlineUsers,
	selectSelectedConvo,
	setOnlineUsers
} from './features/chatSlice'

function App() {
	const user = useSelector(selectUser)
	const onlineUsers = useSelector(selectOnlineUsers)
	const convos = useSelector(selectConvos)
	const selectedConvo = useSelector(selectSelectedConvo)

	const dispatch = useDispatch()

	useEffect(() => {
		function receiveMessage(messageDeets) /*: Message*/ {
			dispatch(addMessageToConvo({ id: messageDeets.from, message: messageDeets }))
		}
		function join() {
			// announce this user as "now online"
			socket.emit('join', { userId: user.userId, userName: user.userName })
		}
		function updateOnlineUsers(usersOnline) {
			dispatch(setOnlineUsers(usersOnline))
		}

		// listen for changes to online users
		socket.on('online-users', updateOnlineUsers)
		// listen for messages
		socket.on('message', receiveMessage)
		socket.on('connect', join)

		// connect when the user is logged in
		if (user) socket.connect()

		return () => {
			socket.off('online-users', updateOnlineUsers)
			socket.off('message', receiveMessage)
			socket.off('connect', join)
		}
	}, [convos, dispatch, onlineUsers, selectedConvo, user, user.userId, user.userName])

	return (
		<>
			<BrowserRouter>
				<Header />

				<Routes>
					<Route path='*' element={<Error />} />
					<Route path='/post' element={<Post />} />
					<Route path='/' element={<Login />} />
					<Route path='/singUp' element={<SingUp />} />
				</Routes>

				<Footer />
			</BrowserRouter>
			<ToastContainer />
		</>
	)
}

export default App
