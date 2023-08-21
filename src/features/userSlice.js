import { createSlice } from '@reduxjs/toolkit';
import { getUser } from '../service/auth.service';

const initialState = {
    user: {
        userId: getUser().userId,
        userName: getUser().userName,
        token: getUser().token,
        loggedIn: getUser().loggedIn,
        isAdmin: getUser().isAdmin,
    },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,

    reducers: {
        saveUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user.user = null;
        },
    },
});

export const { saveUser, logout } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectLoggedIn = (state) => state.user.user.loggedIn;

export default userSlice.reducer;
