import React, { useState } from 'react'
import "./login.css"
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged, signInWithEmailAndPassword  } from 'firebase/auth';
import { auth,db } from '../../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const initialState = {
        email:"",
        password:""
      }
    const [userData, setUserData] = useState(initialState)
    const [disable, setDisable] = useState(false)
    const navigate = useNavigate()

    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;
          navigate("/")
          // ...
        } else {
          // User is signed out
          // ...
        }
      
      })
    
      const handleChange = (e) => {
        const obj = {[e.target.name]: e.target.value}
        setUserData((val) => ({...val, ...obj}))
      }
      const handleSubmit = (e) => {
        e.preventDefault()
        setDisable(true)
        
        signInWithEmailAndPassword (auth, userData.email, userData.password).then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            createUserDoc(user)
            toast.success("Logged in successfully!!")
            // navigate("/")
            setDisable(false)
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage)
            setDisable(false)
            // ..
          });
        
    
        const createUserDoc = async(user) => {
          if(!user) return;
          const userRef = doc(db, "users", user.uid)
          const usersData = await getDoc(userRef)
          if(!usersData.exists()){
    
            try {
              const data = {
                name: user.displayName !== null? user.displayName : "",
                email: user.email,
                photoURL: user.photoURL !==null ? user.photoURL: null,
                createdAt: new Date(),
              }
              // const dataref = collection(db, "username")
              await setDoc(userRef, data);
              toast.success("Doc created")
            } catch (error) {
              console.log(error)
              toast.error(error.message)
            }
          } else {
            // toast.error("Doc already exists")
          }
        } 
    
      }
  return (
    <div className='main-login-container'>
      <form className='login-container'>
      <input type="email" name='email' placeholder='Email' onChange={handleChange} value={userData.email} required/>
      <input type="password" name='password' placeholder='Password' onChange={handleChange} value={userData.password} required/>
      <button className={disable? "disable-button":'login-button'} onClick={handleSubmit} disabled={disable}>Login</button>
      <div>or</div>
      <div className='routing-div' onClick={() => navigate("/register")}>Don't have account, please sign up</div>
    </form>
      </div>
  )
}

export default Login
