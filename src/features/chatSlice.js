import { createSlice } from '@reduxjs/toolkit'

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

	// all of this users current conversations
	convos: [],

	// reference to an open conversation
	selectedConvo: null // Conversation | null
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
		setOnlineUsers(state, action) {
			state.onlineUsers = action.payload
		},
		setConvos(state, { payload }) {
			state.convos = payload
		},
		openConvo(state, { payload }) {
			const existingConvo = state.convos.find(convo => convo.id === payload.userId)
			// if the convo doesn't exist, start a new one
			if (!existingConvo) {
				const newConvo = createNewConvo(payload.userId, payload.userName)
				state.selectedConvo = newConvo
				// add to the list of conversations
				state.convos = [newConvo, ...state.convos]
			} else {
				state.selectedConvo = existingConvo
			}
		},
		closeSelectedConvo(state) {
			state.selectedConvo = null
		}
	}
})

export const { setOnlineUsers, openConvo, closeSelectedConvo, setConvos } = chatSlice.actions

export const selectChat = state => state.chat
export const selectOnlineUsers = state => state.chat.onlineUsers
export const selectConvos = state => state.chat.convos
export const selectSelectedConvo = state => state.chat.selectedConvo

export const util = {
    // this may seem unecessary, but it helps you as a developer
    // know what the default structure of a message is.
    createMessage({from, to, text, timestamp }) {
        return {
            from,
            to,
            text, 
            timestamp
        }
    }
}


export default chatSlice.reducer
