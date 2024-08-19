
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

  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/auth.user
  //     const uid = user.uid;
  //     console.log(user)
  //     console.log(uid)
  //     // ...
  //   } else {
  //     // User is signed out
  //     // ...
  //   }
  
  // })
  
  const [user, setUser] = useState({})
  useEffect(() => {
    onAuthStateChanged(auth,(currentUser) => {
      setUser(currentUser)
    })
  },[])

  console.log(user)

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
     {/* <Home/> */}
     {/* <ExpensePage/> */}
    </>
  )
}

export default App
