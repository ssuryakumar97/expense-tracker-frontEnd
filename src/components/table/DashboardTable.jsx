import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import "./dashboardTable.css"
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db  } from '../../firebase';
import { collection, getDocs, query, doc, deleteDoc } from 'firebase/firestore';
import SearchIcon from '@mui/icons-material/Search';
import { unparse } from 'papaparse';







const DashboardTable = () => {
  const [user, setUser] = useState({})
  const [transactions, setTransactions] = useState([])
  const [searchFilter, setSearchFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [noSort, setNoSort] =useState(true)
  const [sortByDate, setSortByDate] =useState(false)
  const [sortByAmount, setSortByAmount] =useState(false)
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

  // const handleChange = 

  

  const handleRadioChange = (e) => {
    if(e.target.name == "noSort"){
      setNoSort(true)
      setSortByAmount(false)
      setSortByDate(false)
    }
    if(e.target.name == "sortByDate"){
      setNoSort(false)
      setSortByAmount(false)
      setSortByDate(true)
    }
    if(e.target.name == "sortByAmount"){
      setNoSort(false)
      setSortByAmount(true)
      setSortByDate(false)
    }
  }

  const filteredTransactions = transactions.filter((val) => {
    return (val.name.toLowerCase().includes(searchFilter.toLowerCase()) && val.category.toLowerCase().includes(categoryFilter.toLowerCase()))
  })

  const sortedTransactions = filteredTransactions.sort((a,b) => {
    if(sortByDate){
      return new Date(a.date) - new Date(b.date)
    } else if(sortByAmount) {
      return a.amount-b.amount
    } else {
      return 0
    }

  })

  const handleDelete = async(e) => {
    const query =  doc(db, "users",user.uid, "transactions",e.id)
    const deleted = await deleteDoc(query)
    window.location.reload()
  }

  const exportcsv = () => {
    var csv = unparse({
      fields: ["name", "date", "amount", "category", "description"],
      data: filteredTransactions
    });
    const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv"
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link)
  }

  return (
    <div className='dashboard-table'>
      <div className='search-container'>
        <div className='search-left-div'>
          <input type="text" className='search-input' name='searchFilter' onChange={(e) => setSearchFilter(e.target.value)} value={searchFilter}/>
          <SearchIcon/>
        </div>
        <div className='search-right-div'>
          <select name="categoryFilter" onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All</option>
            <option value="food">Food</option>
              <option value="groceries">Groceries</option>
              <option value="education">Education</option>
              <option value="health">Health</option>
              <option value="subscriptions">Subscriptions</option>
              <option value="clothing">Clothing</option>
              <option value="travelling">Travelling</option>
              <option value="movie">Movie</option>
            </select>
        </div>
    </div>
        <div className='transaction'>
            <div className='myTransactions'>Transactions</div>
            <div className='sort-div'>
              
                <div className='sort'><input type="radio" name="noSort" onChange={handleRadioChange} checked={noSort}/>No sort</div>
                <div className='sort'><input type="radio" name="sortByDate" onChange={handleRadioChange} checked={sortByDate}/>Sort by Date</div>
                <div className='sort'><input type="radio" name="sortByAmount" onChange={handleRadioChange} checked={sortByAmount}/>Sort by Amount</div>
            </div>
            <div className='export-div' onClick={exportcsv}>Export to csv</div>
        </div>
       <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Category</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTransactions.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.date}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
              <TableCell align="right">{row.category}</TableCell>
              <TableCell align="right">{row.description}</TableCell>
              <TableCell align="right" onClick={() => handleDelete(row)}><DeleteOutlineIcon style={{color: "red", cursor:'pointer'}}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  )
}




export default DashboardTable
