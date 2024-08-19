import React, { useEffect, useState } from 'react'
import Topbar from '../../components/topbar/Topbar'
import "./expensePage.css"
import DashboardTable from '../../components/table/DashboardTable'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../../firebase'
import { addDoc, collection } from 'firebase/firestore'
import { toast } from 'react-toastify'

const ExpensePage = () => {

  const initialState = {
    name:"",
    amount:"",
    category: "",
    date:"",
    description: ""
  }
  const [expenseData, setExpenseData] = useState(initialState)
  const [existing, setExisting] = useState(true)
  const [newCat, setNewCat] = useState(false)
  const [user, setUser] = useState({})
  const [disable, setDisable] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth,(currentUser) => {
    setUser(currentUser)
  })
},[])

  const handleChange = (e) => {
    if(e.target.name == "amount") {
      const obj = {[e.target.name]: +e.target.value}
      setExpenseData((prev) => ({...prev, ...obj}))

    } else {
      const obj = {[e.target.name]: e.target.value}
      setExpenseData((prev) => ({...prev, ...obj}))
    }
  }

  const handleRadioChange = (e)=>{
    if(e.target.name =="existing") {
      setExisting(true)
      setNewCat(false)
    } else {
      setExisting(false)
      setNewCat(true)
    }
}

const handleSubmit = () => {
  setDisable(true)
  addTransaction(expenseData)
}

async function addTransaction(transaction){
  try {
    const docRef = await addDoc(collection(db, `users/${user.uid}/transactions`),transaction)
    console.log("Document written with ID:", docRef.id)
    // toast.success("Transaction Added")
    setDisable(false)
    setExpenseData(initialState)
    window.location.reload()
  } catch (error) {
    console.log(error)
    toast.error("Couldn't add transaction") 
  }
}
  return (
    <div>
      <Topbar/>
      <div className='left-div'>
        <form action="" className='expense-form'>
            <label htmlFor="">Name:</label>
            <input type="text" required name='name' value={expenseData.name} onChange={handleChange} placeholder='Enter expense name'/>
            <label htmlFor="">Amount:</label>
            <input type="number" required name='amount' value={expenseData.amount} onChange={handleChange} placeholder='Enter Amount'/>
            <span className='category-span'>
            <label htmlFor="">Category:</label>

            <input type='radio' name='existing' onChange={handleRadioChange} checked={existing}/><label htmlFor=''>Existing</label>
            <input type='radio' name="new" onChange={handleRadioChange} checked={newCat}/><label htmlFor=''>New</label>
            </span>
            {newCat ?<input type="text" name='category' value={expenseData.category} onChange={handleChange} placeholder='Category' required /> :
            (<select name="category"  onChange={handleChange} required>
              <option value="select category" disabled selected >Select Category</option>
              <option value="food">Food</option>
              <option value="groceries">Groceries</option>
              <option value="education">Education</option>
              <option value="health">Health</option>
              <option value="subscriptions">Subscriptions</option>
              <option value="clothing">Clothing</option>
              <option value="travelling">Travelling</option>
              <option value="movie">Movie</option>
              <option value="custom">Other</option>
            </select>)}            
            <label htmlFor="">Date:</label>
            <input type="date" name="date" value={expenseData.date} onChange={handleChange} placeholder='dd-mm-yyyy' required />
            <label htmlFor="">Description:</label>
            <input type="text" name='description' value={expenseData.description} onChange={handleChange} placeholder='Description' />
            <button className={disable?'disable-button':'expense-button'} onClick={handleSubmit} disabled={disable}>Add Expense</button>
        </form>
        <DashboardTable/>
      </div>
    </div>
  )
}

export default ExpensePage
