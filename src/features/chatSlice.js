import { createSlice } from '@reduxjs/toolkit'

class OrderedMap {
	static getOrderedValues({ order, items }) {
		return order.map(k => items[k])
	}

	static has({ items }, key) {
		return items[key] !== undefined
	}

	static fromIterable(iterable) {
		const o = []
		const m = {}

		iterable.forEach(([k, v]) => {
			o.push(k)
			m[k] = v
		})
		return { order: o, items: m }
	}
}

/*
type UserId = string

type User = 
    { userId: UserId
    , userName: String
    }

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

const initialState = {
	onlineUsers: {}, // Map<UserId, User>

	// every user that ever came online. used for id resolution
	contacts: {}, // Map<UserId, User>

	// all of this users current conversations
	convos: { order: [], items: {} },

	// reference to an open conversation
	selectedConvo: null // UserId | null
}

// UTILITY
const createNewConvo = (userId, userName) => ({
	id: userId,
	name: userName,
	messages: [],
	totalUnread: 0
})

// REDUCER
export const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		setOnlineUsers(state, { payload }) {
			state.onlineUsers = payload
			state.contacts = Object.entries(payload).reduce((acc, [id, user]) => ({ ...acc, [id]: user }), {
				...state.contacts
			})
		},
		setConvos(state, { payload }) {
			const cvs = OrderedMap.fromIterable(payload.map(convo => [convo.id, convo]))
			state.convos = cvs
		},
		openConvo(state, { payload }) {
			if (OrderedMap.has(state.convos, payload.userId)) {
				state.selectedConvo = payload.userId
			} else {
				const newConvo = createNewConvo(payload.userId, payload.userName)
				state.convos.items[payload.userId] = newConvo
				state.convos.order.unshift(payload.userId)
				state.selectedConvo = payload.userId
			}

            state.convos.items[payload.userId].totalUnread = 0
		},
		closeSelectedConvo(state) {
			state.selectedConvo = null
		},
		addMessageToConvo(state, { payload }) {
			if (OrderedMap.has(state.convos, payload.id)) {
	
				// conversation already exists, add message
				state.convos.items[payload.id].messages.push(payload.message)

				// count the new message as unread if it's not open
				if (state.selectedConvo !== payload.id) state.convos.items[payload.id].totalUnread += 1

				// move this conversation to the top of the list
				const currentIdx = state.convos.order.findIndex(k => k === payload.id)
				if (currentIdx === -1) {
					state.convos.order.unshift(payload.id)
				} else if (currentIdx !== 0) {
					state.convos.order.splice(currentIdx, 1)
					state.convos.order.unshift(payload.id)
				}
			} else {

				// conversation does not exist, create and add it
				const username = state.contacts[payload.id].userName
				const newConvo = createNewConvo(payload.id, username)
				newConvo.totalUnread += 1
				newConvo.messages.push(payload.message)
				state.convos.items[payload.id] = newConvo
				state.convos.order.unshift(payload.id)
			}
		},
        clearUnread(state, {payload}) {
            state.convos.items[payload].totalUnread = 0
        }
	}
})

export const { setOnlineUsers, openConvo, closeSelectedConvo, setConvos, addMessageToConvo } = chatSlice.actions

export const selectChat = state => state.chat
export const selectOnlineUsers = state => state.chat.onlineUsers
export const selectConvos = state => OrderedMap.getOrderedValues(state.chat.convos)
export const selectSelectedConvo = state => {
	if (!state.chat.selectedConvo) return null
	return state.chat.convos.items[state.chat.selectedConvo]
}
export const util = {
	// this may seem unecessary, but it helps you as a developer
	// know what the default structure of a message is.
	createMessage({ from, to, text, timestamp }) {
		return {
			from,
			to,
			text,
			timestamp
		}
	}
}

export default chatSlice.reducer
