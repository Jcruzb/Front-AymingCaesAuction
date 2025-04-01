import { Route, Routes } from 'react-router-dom'; // Importa desde react-router-dom
import NotFound from './Views/NotFound/NotFound';
import Login from './Views/Login/Login';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import RoleProtectedRoute from './Components/ProtectedRoute/RoleProtectedRoute';

import './App.css';
import Home from './Views/Home/Home';
import ProjectsList from './Views/Projects/ProjectsList';
import ProjectCreateForm from './Views/Projects/ProjectsCreateForm';
import CompanyList from './Views/Company/CompanyList';
import CompanyCreateForm from './Views/Company/CompanyCreateForm';
import CompanyEditForm from './Views/Company/CompanYEditForm';
import ProjectsEditForm from './Views/Projects/ProjectsEditForm';
import AuctionCreateFromProject from './Views/Auction/AuctionCreateFromProject';
import ProjecDetail from './Views/Projects/ProjectDetail';
import ProjectListClient from './Views/Projects/ProjectListClient';
import CreateUserForm from './Views/Users/CreateUserForm';
import UserList from './Views/Users/UserList';
import AuctionsList from './Views/Auction/AuctionsList';
import AuctionDetail from './Views/Auction/AuctionDetail';

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        

        {/* Rutas exclusivas para administradores */}
        <Route element={<RoleProtectedRoute allowedRoles={['administrador']} />}>
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/projectsCreateForm" element={<ProjectCreateForm />} />
          <Route path="/projectsEditForm/:id" element={<ProjectsEditForm />} />
          <Route path="/companies" element={<CompanyList />} />
          <Route path="/companiesCreateForm" element={<CompanyCreateForm />} />
          <Route path="/companiesEditForm/:id" element={<CompanyEditForm />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/usersCreateForm" element={<CreateUserForm />} />
        </Route>

        {/* Rutas exclusivas para usuarios */}
        <Route element={<RoleProtectedRoute allowedRoles={['usuario']} />}>
          <Route path="/projects/auctions" element={<ProjectListClient />} />
        </Route>

        {/* Rutas accesibles para ambos */}
        <Route path="/project/:id" element={<ProjecDetail />} />
        <Route path="/projectsAuction/:id" element={<AuctionCreateFromProject />} />
        <Route path="/auctions" element={<AuctionsList />} />
        <Route path="/auction/detail/:id" element={<AuctionDetail />} />
      </Route>

      {/* Ruta catch-all, debe ir al final */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;