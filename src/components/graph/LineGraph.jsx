import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { auth, db  } from '../../firebase';
import { collection, getDocs, query, doc, deleteDoc } from 'firebase/firestore';


const LineGraph = () => {
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

  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const filter = transactions.map((val) => {
    return {...val, month: month[(new Date(val.date)).getMonth()]}
  })

  const result = Object.groupBy(filter, ({ month }) => month);

  const obj ={}

  for(let i=0; i<filter.length; i++){
    obj[filter[i].month] = (obj[filter[i].month] || 0) + filter[i].amount
  }

  const linegraphArray = Object.entries(obj)

  const lineData = linegraphArray.map((val) => {
    return {
      month: val[0],
      amount: val[1]
    }
  })
  const sorter = (a, b) => {
    
       return month.indexOf(a.month) - month.indexOf(b.month);
    ;
 };

  lineData.sort(sorter)
  return (
    
    <>
      <ResponsiveContainer width={700} aspect={2/1}>
        <LineChart
          width={500}
          height={300}
          data={lineData}
          margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
            </>
    
  )
}

export default LineGraph
