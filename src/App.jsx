
import { Route, Routes } from 'react-router'
import NotFound from './Views/NotFound/NotFound'
import Login from './Views/Login/Login'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'





import './App.css'
import Home from './Views/Home/Home'
import ProjectsList from './Views/Projects/ProjectsList'
import ProjectCreateForm from './Views/Projects/ProjectsCreateForm'
import CompanyList from './Views/Company/CompanyList'
import CompanyCreateForm from './Views/Company/CompanyCreateForm'

function App() {


  return (
    <Routes>
      <Route path='*' element={<NotFound />} />
      <Route path='/login' element={<Login />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route path='/home' element={<Home />} />

        {/* Projects */}
        <Route path='/projects' element={<ProjectsList />} />
        <Route path='/projectsCreateForm' element={<ProjectCreateForm />} />

        {/* Company */}
        <Route path='/companies' element={<CompanyList />} />
        <Route path='/companiesCreateForm' element={<CompanyCreateForm/>}/>

      </Route>

    </Routes>
  )
}

export default App
