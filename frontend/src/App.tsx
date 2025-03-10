
import { Route, Routes } from 'react-router'
import Home from './Pages/Home'
import LoginPage from "@/Pages/LoginPage"
import SignUpPage from './Pages/Signup'
import SidebarLayout from './components/SidebarLayout'
import Dashboard from './Pages/Dashboard'
 const App = ()=> {
  return (
   <Routes>
    <Route path='/' index element={<Home/>}/>
    <Route path='/login' element={<LoginPage/>}/>
    <Route path='/signup' element={<SignUpPage/>}/> 
    {/* {here we define the sidebar layout for all dashboard pagea} */}
    <Route path='/dashboard' element = {<SidebarLayout/>}>
      <Route  index element={<Dashboard/>} />
    </Route>
   </Routes>
  )
}

export default App
