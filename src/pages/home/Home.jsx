import React, { useEffect, useState } from 'react'
import Topbar from '../../components/topbar/Topbar'
import ExpenseCard from '../../components/expenseCard/ExpenseCard'
import "./home.css"
import LineGraph from '../../components/graph/LineGraph'
import DashboardTable from '../../components/table/DashboardTable'
import PieGraph from '../../components/graph/PieGraph'
import { auth, db  } from '../../firebase';
import { collection, getDocs, query, doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'

const Home = () => {
  const [user, setUser] = useState({})
  const [transactions, setTransactions] = useState([])
  useEffect(() => {
    onAuthStateChanged(auth,(currentUser) => {
      setUser(currentUser)
    })
  },[])
  useEffect(() => {
    const fetchTransactions = async()=>{
      try {
        const q = query(collection(db, `users/${user.uid}/transactions`))
        const querySnapshot = await getDocs(q) 
        console.log(querySnapshot)
        const transactionArray =[]
        querySnapshot.forEach((doc) => {
          // console.log(doc.id)
          transactionArray.push({id:doc.id,...doc.data()})
        })
        setTransactions(transactionArray)
      } catch (error) {
        console.log(error)
      }
    }
    fetchTransactions()
  },[user])

  const totalExpenses= transactions.reduce((acc, val) => {
    return acc = acc+val.amount
  },0)

  console.log(totalExpenses)
  return (
    <div>
        <Topbar/>
        <div className='cards'>
            <ExpenseCard text="Total Expenses" amount={totalExpenses}/>
        </div>
        <div className='graph-container'>
            <LineGraph/>                  
            <PieGraph/>
        </div>
        <DashboardTable/>
    </div>
  )
}

export default Home
