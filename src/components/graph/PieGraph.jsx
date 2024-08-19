// import { Tooltip } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'

import { PieChart, Pie, Sector, Cell, ResponsiveContainer,Tooltip, Legend } from 'recharts';
import { auth, db  } from '../../firebase';
import { collection, getDocs, query, doc, deleteDoc } from 'firebase/firestore';

const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];

  let renderLabel = function(entry) {
    return entry.name;
}

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#b2653e', '#f81b1b','#a442ff', '#5eff42', '#ff4297'];

  const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
// console.log(data[index].name)
  return   (
          <>
          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}    
          </text>
          </>
        );   
};

// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);
//   console.log(data[index].name)
//     return data[index].name, (
//       <>
//       <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
//         {`${(percent * 100).toFixed(0)}%`}    
//       </text>
//       </>
//     );
//   };

const PieGraph = () => {
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

  const obj ={}

  for(let i=0; i<transactions.length; i++){
    obj[transactions[i].category] = (obj[transactions[i].category] || 0) + transactions[i].amount
  }
  console.log(obj)

  const piegrapharray = Object.entries(obj)
  const pieGraphData = piegrapharray.map((val) => {
    return {
      name: val[0],
      amount: val[1]
    }
  })

  console.log(pieGraphData)

  return (
    
      <ResponsiveContainer width={400} aspect={1.5/1}>
        <PieChart width={400} height={400}>
          <Pie
            data={pieGraphData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="amount"
          >
            {pieGraphData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
            <Tooltip/>
            <Legend/>
        </PieChart>
      </ResponsiveContainer>
    
  )
}

export default PieGraph
