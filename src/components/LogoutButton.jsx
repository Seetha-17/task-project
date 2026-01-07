import React from 'react'
import {Button} from "./index"
import { useDispatch } from 'react-redux'
import { logout as storeLogout} from '../features/authSlice'
import authService from '../appwrite/auth'


function LogoutButton(){

  const dispatch = useDispatch()

  function logout(){
    authService.logout()
    .then(()=>dispatch(storeLogout()))
    .catch((err)=> console.log(err))
  }

  return (
    <Button onClick={logout} children="Logout"/>
  )
}

export default LogoutButton