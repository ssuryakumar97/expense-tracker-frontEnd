import React, { useState } from 'react'
import "./register.css"

import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth,db } from '../../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const initialState = {
    name:"",
    email:"",
    password:"",
    confirmPassword:""
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
    if(userData.password !== userData.confirmPassword){
      toast.error("Password doesn't match please check")
      setDisable(false)
    } else {
      createUserWithEmailAndPassword(auth, userData.email, userData.password).then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log(user)
        createUserDoc(user)
        toast.success("User created!!")
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
    }

    const createUserDoc = async(user) => {
      if(!user) return;
      console.log(user.uid)
      const userRef = doc(db, "users", user.uid)
      const usersData = await getDoc(userRef)
      if(!usersData.exists()){

        try {
          const data = {
            name: user.displayName !== null? user.displayName : userData.name,
            email: user.email,
            photoURL: user.photoURL !==null ? user.photoURL: null,
            createdAt: new Date(),
          }
          // const dataref = collection(db, "username")
          await setDoc(userRef, data);
          toast.success("Doc created")
        } catch (error) {
          console.log(error)
          // toast.error(error.message)
        }
      } else {
        toast.error("Doc already exists")
      }
    } 

    console.log(userData)
  }
  return (
    <div className='main-register-container'>
      <form className='register-container'>

      <input type="text" name="name" placeholder='Full Name' onChange={handleChange} value={userData.name} required/>
      <input type="email" name='email' placeholder='Email' onChange={handleChange} value={userData.email} required/>
      <input type="password" name='password' placeholder='Password' onChange={handleChange} value={userData.password} required/>
      <input type="password" name='confirmPassword' placeholder='Confirm Password' onChange={handleChange} value={userData.confirmPassword} required/>
      <button className={disable? "disable-button":'register-button'} onClick={handleSubmit} disabled={disable}>Register</button>
      <div>or</div>
      <div className='routing-div' onClick={() => navigate("/login")}>Already have an account</div>
    </form>
      </div>
  )
}

export default Register
