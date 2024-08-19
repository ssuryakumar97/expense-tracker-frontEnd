import React from 'react'
import './topbar.css'
import { signOut } from "firebase/auth";
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';


const Topbar = () => {
  const navigate = useNavigate()
  const handleLogout =() => {
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate("/login")
    }).catch((error) => {
      console.log(error)
    });
  }
  return (
    <div className='topbar-container'>
      <div className='left-container'>
      <div className='topbar-logo'>Expense Tracker</div>
      </div>
      <div className='right-container'>
        <div className='topbar-dashboard' onClick={() => navigate("/")}>Dashboard</div>
        <div className='topbar-expenses' onClick={() => navigate("/expenses") }> Add Expenses</div>
        <div className='topbar-income' onClick={handleLogout}>Logout</div>
      </div>
    </div>
  )
}

export default Topbar
