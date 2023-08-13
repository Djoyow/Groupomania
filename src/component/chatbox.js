import { useState, useMemo, useEffect } from 'react'
import dayjs from 'dayjs'
import Button from 'react-bootstrap/Button'
import { faAngleLeft, faCaretDown, faComments } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { selectUser } from '../features/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import {
	selectConvos,
	selectOnlineUsers,
	openConvo,
	closeSelectedConvo,
	selectSelectedConvo,
	util
} from '../features/chatSlice'
import { sendMessage } from '../socket'

function formatTime(ms) {
	const day = dayjs(ms)
	const now = dayjs()

	if (now.diff(day, 's') < 1) return 'now'
	if (now.diff(day, 'd') < 1) return day.format('hh:mm A')
	if (now.diff(day, 'w') < 1) return day.format('dddd') // format as week
	return day.format('DD/MM/YYYY')
}

function isNull(param) {
	return param === null || param === undefined
}

function TimeDiff({ timestamp }) {
	const [display, setDisplay] = useState(formatTime(timestamp))

	useEffect(() => {
		const intervalId = setInterval(() => {
			setDisplay(() => formatTime(timestamp))
		}, 300)

		return () => {
			clearInterval(intervalId)
		}
	}, [timestamp])

	return <p className='small text-muted mb-1'>{display}</p>
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
					{!isNull(lastMessageTime) && <TimeDiff timestamp={lastMessageTime} />}
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
	const [currentTab, setCurrentTab] = useState(CONVERSATION_TAB)

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
				onSelect: () => {
					onSelect({ userId: convo.id, userName: convo.name })
				}
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
				onSelect: () => {
					onSelect({ userId: user.userId, userName: user.userName })
				}
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
						className={`nav-link ${currentTab === CONVERSATION_TAB && 'active'}`}
						aria-current='page'
						onClick={switchTab(CONVERSATION_TAB)}
					>
						{CONVERSATION_TAB}
					</button>
				</li>
				<li className='nav-item'>
					<button
						className={`nav-link ${currentTab === ONLINEUSERS_TAB && 'active'}`}
						onClick={switchTab(ONLINEUSERS_TAB)}
					>
						{ONLINEUSERS_TAB}
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

function ChatWindow({ closeChat, minimizeWindow, send, conversation }) {
	const user = useSelector(selectUser)
	const [message, setMessage] = useState('')

	const updateMessage = e => setMessage(e.target.value)

	const checkForEnter = e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()

			if (message !== '') {
				send(message)
				setMessage('')
			}
		}
	}

	const renderTheirMessage = msg => (
		<div className='d-flex flex-row justify-content-start mb-4'>
			<ProfileIcon />
			<div className='p-3 ms-3' style={{ borderRadius: '15px', backgroundColor: 'rgba(57, 192, 237,.2)' }}>
				<p className='small mb-0'>{msg}</p>
			</div>
		</div>
	)

	const renderMyMessage = msg => (
		<div className='d-flex flex-row justify-content-end mb-4'>
			<div className='p-3 me-3 border' style={{ borderRadius: '15px', backgroundColor: '#fbfbfb' }}>
				<p className='small mb-0'>{msg}</p>
			</div>
			<ProfileIcon />
		</div>
	)

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
				<p className='mb-0 fw-bold'>{conversation.name}</p>
				<Button size='sm' variant='' onClick={minimizeWindow}>
					<FontAwesomeIcon icon={faCaretDown} size='lg' />
				</Button>
			</div>

			{/* Chat Body */}
			<div className='card-body d-flex flex-column justify-content-between'>
				<div>
					{conversation.messages.length === 0
						? 'No messages to show'
						: conversation.messages.map(message => {
								if (message.from === user.userId) {
									// render my message
									return renderMyMessage(message.text)
								} else {
									// render their message
									return renderTheirMessage(message.text)
								}
						  })}
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

export default function ChatBox() {
	const user = useSelector(selectUser)
	const convos = useSelector(selectConvos)
	const selectedConvo = useSelector(selectSelectedConvo)
	const onlineUsers = useSelector(selectOnlineUsers)
	const dispatch = useDispatch()

	const [isOpen, setIsOpen] = useState(false)

	// UTILITY FUNCTION
	const isOnline = userId => onlineUsers[userId] !== undefined

	const minimizeFloatingChat = () => setIsOpen(false)
	const openFloatingChat = () => setIsOpen(true)

	// closes the open conversation
	const closeOpenConvo = () => dispatch(closeSelectedConvo())

	// open a conversation with another user
	const openConversation = userDeets => {
		dispatch(openConvo(userDeets))
	}

	const onlineUsersList = useMemo(
		() => Object.values(onlineUsers).filter(u => u.userId !== user.userId),
		[onlineUsers, user]
	)

	const onlineUsersOrderedByUserName = useMemo(
		() => onlineUsersList.sort((u1, u2) => (u1.userName > u2.userName ? 1 : -1)),
		[onlineUsersList]
	)

	const send = message => {
		const newMessage = util.createMessage({
			from: user.userId,
			to: selectedConvo.id,
			text: message,
			timestamp: Date.now()
		})

		sendMessage(newMessage)
	}

	return (
		<>
			<div className='position-fixed bottom-0 end-0 m-3'>
				{isOpen ? (
					<div style={{ maxWidth: '550px', width: '550px', maxHeight: '600px' }}>
						{selectedConvo === null ? (
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
								send={send}
								conversation={selectedConvo}
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
