import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    posts: [] 
};


export const postsSlice = createSlice({
    name: 'posts',
    initialState,

    reducers: {
        savePosts: (state, action) => {
            state.posts = action.payload;
        } 
    },
});

export const { savePosts } = postsSlice.actions;

export const selectPosts = (state) => state.posts.posts;

export default postsSlice.reducer;
