
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
import CompanyEditForm from './Views/Company/CompanYEditForm'
import ProjectsEditForm from './Views/Projects/ProjectsEditForm'
import AuctionCreateFromProject from './Views/Auction/AuctionCreateFromProject'
import ProjecDetail from './Views/Projects/ProjectDetail'
import ProjectListClient from './Views/Projects/ProjectListClient'
import CreateUserForm from './Views/Users/CreateUserForm'
import UserList from './Views/Users/UserList'

function App() {


  return (
    <Routes>
      <Route path='*' element={<NotFound />} />
      <Route path='/login' element={<Login />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route path='/home' element={<Home />} />

        {/* Project */}
        <Route path='/projects' element={<ProjectsList />} />
        <Route path='/projectsCreateForm' element={<ProjectCreateForm />} />
        <Route path='/projectsEditForm/:id' element={<ProjectsEditForm />} />
        <Route path='/project/:id' element={<ProjecDetail/>} />
        <Route path='/projects/auctions' element={<ProjectListClient/>} />

        {/* Company */}
        <Route path='/companies' element={<CompanyList />} />
        <Route path='/companiesCreateForm' element={<CompanyCreateForm />} />
        <Route path='/companiesEditForm/:id' element={<CompanyEditForm />} />

        {/* Auction */}
        <Route path='/projectsAuction/:id' element={<AuctionCreateFromProject />} />

        {/* Bids */}
        <Route path='/bid/:id' element={<AuctionCreateFromProject />} />

        {/* Users */}
        <Route path='/usersCreateForm' element={<CreateUserForm />} />
        <Route path='/users' element={<UserList />} />



      </Route>

    </Routes>
  )
}

export default App
