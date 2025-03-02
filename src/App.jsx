
import { Route, Routes } from 'react-router'
import NotFound from './Views/NotFound/NotFound'
import Login from './Views/Login/Login'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'





import './App.css'
import Home from './Views/Home/Home'
import ProjectsList from './Views/Projects/ProjectsList'
import ProjectCreateForm from './Views/Projects/ProjectsCreateForm'

function App() {


  return (
    <Routes>
      <Route path='*' element={<NotFound />} />
      <Route path='/login' element={<Login />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route path='/home' element={<Home />} />

        {/* Projects */}
        <Route path='/projects' element={<ProjectsList/>}/>
        <Route path='/projectsCreateForm' element={<ProjectCreateForm/>}/>

      </Route>

    </Routes>
  )
}

export default App
