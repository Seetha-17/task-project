import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    todos:[],
}

const todoSlice = createSlice({
    name:"todos",
    initialState,
    reducers:{
        addTodos:(state,action)=>{
            state.todos = action.payload
        },
        addSingleTodo:(state,action)=>{
            state.todos.push(action.payload)
        }
    }
})

export const {addTodos,addSingleTodo} = todoSlice.actions;
export default todoSlice.reducer;