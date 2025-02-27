
import { Route, Routes } from 'react-router'
import NotFound from './Views/NotFound/NotFound'
import Login from './Views/Login/Login'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'





import './App.css'

function App() {


  return (
<Routes>
      <Route path='*' element={<NotFound/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path="/" element={<ProtectedRoute />}>
      
      </Route>

    </Routes>
  )
}

export default App
