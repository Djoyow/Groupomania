import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import postsReducer from '../features/postSlice';
import userListeReducer from '../features/userListeSlice'
import chatReducer from '../features/chatSlice'

export default configureStore({
    reducer: {
        user: userReducer,
        posts: postsReducer,
        userListe: userListeReducer,
        chat: chatReducer
    },
});
