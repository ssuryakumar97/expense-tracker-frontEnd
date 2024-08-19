import React from 'react'
import "./expenseCard.css"

const ExpenseCard = ({text, amount}) => {
  return (
    <div className='expense-card'>
      <div className='expense-font'>{text}</div>
      <div className='expense-amount'>₹{amount}</div>
    </div>
  )
}

export default ExpenseCard
