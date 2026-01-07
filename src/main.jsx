import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { HomePage, LoginPage, SignupPage } from './pages'
import { Provider } from 'react-redux'
import store from './store/store.js'
import App from './App.jsx'
import { AuthLayout, NotFound, Todos, ErrorBoundary } from "./components"
import AcitivityLogsPage from './pages/AcitivityLogsPage.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/' element={<HomePage />} />
      <Route path='/signup' element={<AuthLayout authentication={false}><SignupPage /></AuthLayout>} />
      <Route path='/login' element={<AuthLayout authentication={false}><LoginPage /></AuthLayout>} />
      <Route path='/todos' element={<AuthLayout><Todos /></AuthLayout>} />
      <Route path='/activitylogs' element={<AuthLayout><AcitivityLogsPage /></AuthLayout>} />
      <Route path='*' element={<NotFound />} />
    </Route>
  )

)

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ErrorBoundary>
  </StrictMode>
)
