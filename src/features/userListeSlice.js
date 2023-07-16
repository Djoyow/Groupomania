import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userListe: [] 
};


export const userListeSlice = createSlice({
    name: 'userListe',
    initialState,

    reducers: {
        saveUserListe: (state, action) => {
            state.userListe = action.payload;
        } 
    },
});

export const { saveUserListe } = userListeSlice.actions;

export const selectUserListe = (state) => state.userListe.userListe;

export default userListeSlice.reducer;
