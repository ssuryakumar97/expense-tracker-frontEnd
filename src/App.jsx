
import './App.css'
import ExpensePage from './pages/expense/ExpensePage'
import Home from './pages/home/Home'
import {BrowserRouter, Routes, Route, Outlet, Navigate} from "react-router-dom"
import Register from './pages/registerPage/Register'
import { ToastContainer } from 'react-toastify'
import Login from './pages/loginPage/Login'
import {onAuthStateChanged } from "firebase/auth"
import { auth } from './firebase'
import { useEffect, useState } from 'react'

const PrivateRoute = ({isAuthenticated}) => {
  return isAuthenticated ? (
    <>
    <Outlet/>
    </> ) : <Navigate to="/login"/>
  
}

function App() {
  
  const [user, setUser] = useState({})
  useEffect(() => {
    onAuthStateChanged(auth,(currentUser) => {
      setUser(currentUser)
    })
  },[])

  return (
    
    <>
      <ToastContainer/>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<PrivateRoute isAuthenticated={user} />} >
          <Route path='/' element={<Home/>} />
          <Route path='/expenses' element={<ExpensePage/>} />
        </Route>
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
