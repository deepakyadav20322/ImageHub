import React, { useState } from 'react'
import Navbar from '../../../components/DashboardTopNavigation'
import { useLocation } from 'react-router';
const Media = () => {

  const [activeTab, setActiveTab] = useState("");

  return (
    <div>
{/* <Navbar/> */}

<div>Dashboard media = {activeTab}</div>
    </div>
  )
}

export default Media