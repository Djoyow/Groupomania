import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import postsReducer from '../features/postSlice';

export default configureStore({
    reducer: {
        user: userReducer,
        posts: postsReducer,
    },
});
