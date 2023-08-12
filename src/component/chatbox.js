import { useEffect, useState, useRef, useMemo } from 'react'
import Button from 'react-bootstrap/Button'
import { faAngleLeft, faCaretDown, faComments, faSearch, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { io } from 'socket.io-client'
import { selectUser } from '../features/userSlice'
import { useSelector } from 'react-redux'

function isNull(param) {
	return param === null || param === undefined
}

function ProfileIcon() {
	return (
		<svg
			width='40'
			height='40'
			viewBox='0 0 100 100'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className='text-secondary'
		>
			<path
				d='M49.5 0C22.2558 0 0 22.1279 0 49.5C0 76.7442 22.1279 99 49.5 99C76.8721 99 99 76.7442 99 49.5C99 22.2558 76.7442 0 49.5 0ZM49.5 25.3256C57.9419 25.3256 64.8488 32.2326 64.8488 40.6744C64.8488 49.1163 57.9419 56.0233 49.5 56.0233C41.0581 56.0233 34.1512 49.1163 34.1512 40.6744C34.1512 32.2326 41.0581 25.3256 49.5 25.3256ZM49.5 88.7674C40.0349 88.7674 31.4651 85.4419 24.686 79.9419C31.7209 72.1395 40.4186 67.9186 49.5 67.9186C58.5814 67.9186 67.2791 72.1395 74.314 79.9419C67.5349 85.4419 58.9651 88.7674 49.5 88.7674Z'
				fill='currentColor'
			/>
		</svg>
	)
}

function ChatSummary({ userName, lastMessage, lastMessageTime, isOnline, unreadCount, onSelect }) {
	return (
		<li className='p-2 border-bottom' style={{ cursor: 'pointer' }} onClick={onSelect}>
			<div className='d-flex justify-content-between gap-2'>
				<div className='d-flex align-items-center flex-row gap-2'>
					<div className='position-relative'>
						<ProfileIcon />
						<span
							className={`position-absolute bottom-0 end-0 p-1 ${
								isOnline ? 'bg-success' : 'bg-warning'
							} border border-light rounded-circle`}
						>
							<span className='visually-hidden'>New alerts</span>
						</span>
					</div>
					<div className='pt-1 d-flex flex-column align-items-start justify-content-center'>
						<p className='fw-bold mb-0'>{userName}</p>
						{!isNull(lastMessage) && <p className='small text-muted'>{lastMessage}</p>}
					</div>
				</div>
				<div className='pt-1 d-flex flex-column align-items-end justify-content-center'>
					{!isNull(lastMessageTime) && <p className='small text-muted mb-1'>{lastMessageTime}</p>}
					{!isNull(unreadCount) && (
						<span className='badge bg-danger rounded-pill float-end'>{unreadCount}</span>
					)}
				</div>
			</div>
		</li>
	)
}

const CONVERSATION_TAB = 'Conversations'
const ONLINEUSERS_TAB = 'Online Users'

function UsersWindow({ closeWindow, conversations, onlineUsers, onSelect, isOnline }) {
	const [currentTab, setCurrentTab] = useState(ONLINEUSERS_TAB)

	const switchTab = tab => () => setCurrentTab(tab)

	const collectionForCurrentView = currentTab === CONVERSATION_TAB ? conversations : onlineUsers

	const hasContentForCurrentView = () => collectionForCurrentView.length > 0

	const emptyMessageForCurrentView =
		currentTab === CONVERSATION_TAB ? "You've not started any converstaions yet" : 'There are no users online'

	const getPropsForChatSummary = param => {
		if (currentTab === CONVERSATION_TAB) {
			const convo = param
			const prop = {
				userName: convo.name,
				unreadCount: convo.unreadCount,
				isOnline: isOnline(convo.id),
				onSelect: () => onSelect(convo)
			}

			const lastMessage = convo.messages[convo.messages.length - 1]

			if (lastMessage) {
				prop.lastMessage = lastMessage.text
				prop.lastMessageTime = lastMessage.timestamp
			}

			return prop
		}

		if (currentTab === ONLINEUSERS_TAB) {
			const user = param
			return {
				userName: user.userName,
				isOnline: true,
				onSelect: () => onSelect(user)
			}
		}

		// should never get here but exists for safety
		return {}
	}

	// return the current
	const currentView = hasContentForCurrentView() ? (
		<ul className='list-unstyled mb-0'>
			{collectionForCurrentView.map(arg => {
				return <ChatSummary key={arg.userId || arg.id} {...getPropsForChatSummary(arg)} />
			})}
		</ul>
	) : (
		<div className='w-100 h-100 d-flex justify-content-center align-items-center'>{emptyMessageForCurrentView}</div>
	)

	return (
		<div className='card p-3' style={{ borderRadius: '15px', overflow: 'hidden' }}>
			<ul className='nav nav-pills'>
				<li className='nav-item'>
					<button
						className={`nav-link ${currentTab === ONLINEUSERS_TAB && 'active'}`}
						onClick={switchTab(ONLINEUSERS_TAB)}
					>
						{ONLINEUSERS_TAB}
					</button>
				</li>
				<li className='nav-item'>
					<button
						className={`nav-link ${currentTab === CONVERSATION_TAB && 'active'}`}
						aria-current='page'
						onClick={switchTab(CONVERSATION_TAB)}
					>
						{CONVERSATION_TAB}
					</button>
				</li>
				<li className='nav-item' style={{ marginLeft: 'auto' }}>
					<Button variant='primary' onClick={closeWindow}>
						<FontAwesomeIcon icon={faCaretDown} size='lg' />
					</Button>
				</li>
			</ul>
			<div className='row'>
				<div style={{ position: 'relative', maxHeight: '600px', height: '600px', overflowY: 'auto' }}>
					{currentView}
				</div>
			</div>
		</div>
	)
}

function ChatWindow({ closeChat, minimizeWindow, sendMessage, userName, conversation }) {
	const user = useSelector(selectUser)
	const [message, setMessage] = useState('')

	const updateMessage = e => setMessage(e.target.value)

	const checkForEnter = e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()

			if (message !== '') {
				sendMessage(message)
				setMessage('')
			}
		}
	}

	return (
		<div className='card' style={{ borderRadius: '15px', height: '600px' }}>
			{/* Chat Header */}
			<div
				className='card-header d-flex justify-content-between align-items-center p-3 bg-info text-white border-bottom-0'
				style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}
			>
				<Button size='sm' variant='' onClick={closeChat}>
					<FontAwesomeIcon icon={faAngleLeft} size='lg' />
				</Button>
				<p className='mb-0 fw-bold'>{userName}</p>
				<Button size='sm' variant='' onClick={minimizeWindow}>
					<FontAwesomeIcon icon={faCaretDown} size='lg' />
				</Button>
			</div>

			{/* Chat Body */}
			<div className='card-body d-flex flex-column justify-content-between'>
				<div>
					{/* Their Message */}
					<div className='d-flex flex-row justify-content-start mb-4'>
						<ProfileIcon />
						<div
							className='p-3 ms-3'
							style={{ borderRadius: '15px', backgroundColor: 'rgba(57, 192, 237,.2)' }}
						>
							<p className='small mb-0'>
								Hello and thank you for visiting MDBootstrap. Please click the video below.
							</p>
						</div>
					</div>
					{/* My Message */}
					<div className='d-flex flex-row justify-content-end mb-4'>
						<div className='p-3 me-3 border' style={{ borderRadius: '15px', backgroundColor: '#fbfbfb' }}>
							<p className='small mb-0'>Thank you, I really like your product.</p>
						</div>
						<ProfileIcon />
					</div>
				</div>

				<div className='form-outline' style={{ marginTop: 'auto' }}>
					<textarea
						className='form-control'
						id='textAreaExample'
						rows='1'
						value={message}
						onChange={updateMessage}
						onKeyDown={checkForEnter}
					></textarea>
				</div>
			</div>
		</div>
	)
}

/* 
type Message = 
    { from: UserId
    , to: UserId
    , text: String
    , timestamp: TimeStamp
    }

type Conversation = 
    { id: UserId
    , name: UserName
    , messages: List<Message>
    , totalUnread: Int
    }
*/

export default function ChatBox() {
	const user = useSelector(selectUser)
	const [isOpen, setIsOpen] = useState(false)

	// reference to an open conversation
	const [openConvo, setOpenConvo] = useState(null)

	const [onlineUsers, setOnlineUsers] = useState({})
	const [convos, setConvos] = useState([]) // Array<Conversation>
	const socketRef = useRef(null)

	const isOnline = userId => onlineUsers[userId] !== undefined

	const minimizeFloatingChat = () => setIsOpen(false)
	const openFloatingChat = () => setIsOpen(true)

	// closes the open conversation
	const closeOpenConvo = () => setOpenConvo(null)

	// open a conversation with another user
	const openConversation = userDeets => {
		const existingConvo = convos.find(convo => convo.id === userDeets.userId)
		// if the convo doesn't exist, start a new one
		if (!existingConvo) {
			const newConvo = {
				id: userDeets.userId,
				name: userDeets.userName,
				messages: [],
				totalUnread: 0
			}
			setOpenConvo(newConvo)
			// add to the list of conversations
			setConvos(ec => [newConvo, ...ec])
		} else {
			setConvos(existingConvo)
		}
	}

	const onlineUsersList = useMemo(
		() => Object.values(onlineUsers).filter(u => u.userId !== user.userId),
		[onlineUsers, user]
	)

	const onlineUsersOrderedByUserName = useMemo(
		() => onlineUsersList.sort((u1, u2) => (u1.userName > u2.userName ? 1 : -1)),
		[onlineUsersList]
	)

	const sendMessage = message => {
		const newMessage = {
			from: user.userId,
			to: openConvo.userId,
			text: message,
			timestamp: Date.now()
		}
		socketRef.current.emit('message', newMessage)
	}

	const receiveMessage = (messageDeets) /*: Message*/ => {
		setConvos(previousConvos => {
			// find the conversation for this user
			const chatIndex = previousConvos.findIndex(c => c.userId === messageDeets.from)

			if (chatIndex === -1) {
				// this is a new conversation started by the other user
				// create a new convo and move it to the top of the conversations
				const newConvo = {
					id: messageDeets.from,
					name: onlineUsers[messageDeets.fromId].userName, // lookup the username from list of online users
					messages: [messageDeets],
					totalUnread: 1
				}

				// add the new conversation at the top of the chat
				previousConvos.unshift(newConvo)
			} else {
				// if there's existing conversation
				const existingConvo = previousConvos[chatIndex]

				// add the message to it
				existingConvo.messages.push(messageDeets)

				// if this conversation is not open, count the new message as unread
				if (openConvo.userId !== messageDeets.from) existingConvo.unreadCount += 1

				// push the conversation to the top of the list
				previousConvos.splice(chatIndex, 1)
				previousConvos.unshift(existingConvo)
			}

			return previousConvos
		})
	}

	// set up connection na listeners
	useEffect(() => {
		const socket = io('http://localhost:5000/')
		// ask for the online users when connection is complete
		socket.on('connect', () => {
			// announce this user as "now online"
			socket.emit('join', { userId: user.userId, userName: user.userName })
		})

		// listen for changes to online users
		socket.on('online-users', onlineUsers => {
            console.log("changes to online users")
            setOnlineUsers(onlineUsers)
        })

		// listen for messages
		socket.on('message', receiveMessage)

		return () => socket.disconnect()
	}, [user])

	return (
		<>
			<div className='position-fixed bottom-0 end-0 m-3'>
				{isOpen ? (
					<div style={{ maxWidth: '550px', width: '550px', maxHeight: '600px' }}>
						{openConvo === null ? (
							<UsersWindow
								closeWindow={minimizeFloatingChat}
								conversations={convos}
								onlineUsers={onlineUsersOrderedByUserName}
								onSelect={openConversation}
								isOnline={isOnline}
							/>
						) : (
							<ChatWindow
								minimizeWindow={minimizeFloatingChat}
								closeChat={closeOpenConvo}
								sendMessage={sendMessage}
								conversation={openConvo}
							/>
						)}
					</div>
				) : (
					<Button variant='primary' onClick={openFloatingChat}>
						<FontAwesomeIcon icon={faComments} size='lg' />
					</Button>
				)}
			</div>
		</>
	)
}
