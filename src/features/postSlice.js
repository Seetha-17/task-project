import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts:[],
}

const postSlice = createSlice({
    name:"post",
    initialState,
    reducers:{
        addPost:(state,action)=>{
            state.posts.push(action.payload);
        },
        addPosts:(state,action)=>{
            state.posts = action.payload;
        },
        removePost:(state,action)=>{
            state.posts = state.posts.filter((post)=> post.$id!== action.payload);
        },
        updatePost: (state, action) => {
            const { id, updatedPost } = action.payload;
            const index = state.posts.findIndex((post) => post.$id === id);
            if (index !== -1) {
                state.posts[index] = updatedPost;
            }
        },
    }
})

export const {addPost,addPosts,removePost,updatePost} = postSlice.actions;
export default postSlice.reducer;