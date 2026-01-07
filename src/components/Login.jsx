import React ,{useState} from 'react'
import {useForm} from 'react-hook-form'
import {Input} from './index'
import authService from '../appwrite/auth'
import {login as loginInStore} from "../features/authSlice"
import {useDispatch} from 'react-redux'
import {Link,useNavigate} from 'react-router-dom'

export const Login = () => {
  const [error, setError] = useState(null)
  const {register, handleSubmit} = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const login = async (data) => {
        setError("");
        try {
            const session = await authService.login(data);
            if(session){
                const userData = await authService.getCurrentUser();
                if(userData){
                    dispatch(loginInStore(userData));
                    navigate("/");
                }
                
            }
        } catch (error) {
            setError(error.message)
        }
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-main-dark-bg">
      <div className="w-full max-w-md bg-secondary-dark-bg rounded-xl shadow-lg p-8 ">
        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-gray-100">Log In to Your Account</h2>
        <p className="mt-2 text-center text-sm text-gray-300">
          Don’t have an account?&nbsp;
          <Link to="/signup" className="font-medium text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>

         {/* Error Message */}
      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}


        {/* Login Form */}
        <form onSubmit={handleSubmit(login)} className="mt-6 space-y-6 w-full max-w-md mx-auto px-4">
          <Input
            placeholder="Enter your email"
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          <Input
            placeholder="Enter your password"
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;