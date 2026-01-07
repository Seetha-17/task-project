import React from 'react'
import {Link, useNavigate} from "react-router-dom"
import {useForm} from 'react-hook-form'
import {Input,Button} from '..'
import authService from '../../appwrite/auth'
import {useDispatch} from 'react-redux'
import {login} from '../../features/authSlice'


function Signup() {

    const [error, setError] = React.useState(null)
    const {register, handleSubmit} = useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const signup = async (data) => {
        setError("");
        try {
            const user = await authService.createAccount(data);
            if (user) {                
                dispatch(login(user))
                navigate('/')
            }
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-main-dark-bg">
          <div className="w-full max-w-md bg-secondary-dark-bg rounded-xl shadow-lg p-8 ">
            {/* Logo Section */}
            <div className="mb-4 flex justify-center">
              <span className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-xl font-bold">
              卂
              </span>
            </div>
      
            {/* Title */}
            <h2 className="text-center text-2xl font-bold text-gray-200">
              Signup to Create Your Account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300">
              Already have an account?&nbsp;
              <Link
                to="/login"
                className="font-medium text-blue-400 hover:underline"
              >
                Sign in
              </Link>
            </p>
      
             {/* Error Message */}
            {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

      
            {/* Signup Form */}
            <form onSubmit={handleSubmit(signup)} className="mt-6 space-y-6 w-full max-w-md mx-auto px-4">
              <Input
                placeholder="Enter your name"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              <Input
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  validate: {
                    matchPattern: (value) =>
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
                      "Invalid email address",
                  },
                })}
              />
              <Input
                placeholder="Enter your password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <Button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Button>
            </form>
          </div>
        </div>
      );
      
      
      
}

export default Signup
