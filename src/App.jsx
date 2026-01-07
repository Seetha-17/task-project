import { useEffect, useState } from "react"
import { Signup } from "./components"
import authService from "./appwrite/auth";
import { useDispatch } from "react-redux";
import { login, logout } from "./features/authSlice";
import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";



function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
      .then((data) => {
        if (data) {
          dispatch(login(data))
        } else {
          dispatch(logout());
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [])

  return !loading ? (
    <div className="flex">
      <Header />
      {/* Main Outlet */}
      <main  className="main-content w-full min-h-screen bg-main-dark-bg">
        <Outlet />
      </main>
    </div>) : null;

}

export default App
