import React, { useEffect, useState } from 'react'
import CustomBarChart from '../Charts/CustomBarChart';
import { prepareExpenseBarChartData } from '../../utils/helper';

const Last30DaysExpense = ({data}) => {

    const [charData, setCharData] = useState([]);

   useEffect(() => {
  console.log("Last30DaysExpense data:", data);

  if (Array.isArray(data)) {
    const result = prepareExpenseBarChartData(data);
    setCharData(result);
  } else {
    setCharData([]);
  }
}, [data]);


  return (
    <div className='card col-span-1'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg'>Last 30 Days Expense</h5>
      </div>

      <CustomBarChart data={charData}  xKey="category" height={300}/>
    </div>
  )
}

export default Last30DaysExpense
