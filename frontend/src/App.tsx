
import { Route, Routes } from 'react-router'
import Home from './Pages/Home'

function App() {


  return (
   <Routes>
    <Route path='/' index element={<Home/>}/>
   </Routes>
  )
}

export default App
