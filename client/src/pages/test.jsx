import React from 'react'
import Layout from '../layout/Layout'
import Datepicker from '../partials/actions/Datepicker'
import DateSelect from '../partials/actions/DateSelect'
import FilterButton from '../partials/actions/FilterButton'
import DashboardAvatars from '../partials/dashboard/DashboardAvatars'
import DashboardCard01 from '../partials/dashboard/DashboardCard01'
import DashboardCard13 from '../partials/dashboard/DashboardCard13'

export const TestPage = () => {
  // 6 4 5 7
    return (
   <Layout>
       <Datepicker />
       <DateSelect />
       <div className='flex justify-end'>
              <FilterButton /> 
       </div>
  
       <DashboardCard01/>
       <DashboardCard13 />
       
   
   </Layout>
  )
}
