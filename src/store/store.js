import React from 'react'
import {configureStore} from "@reduxjs/toolkit"
import authSlice from "../features/authSlice"
import postSlice from "../features/postSlice"
import todoSlice from "../features/todoSlice"

const store = configureStore({
    reducer:{
        auth:authSlice,
        post:postSlice,
        todo:todoSlice,
    },
})

export default store