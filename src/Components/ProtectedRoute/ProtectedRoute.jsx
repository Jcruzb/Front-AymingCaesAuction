import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from '../../Contexts/AuthContext';
import Navbar from "../Navbar/Navbar";
import { Container } from "@mui/material";


const ProtectedRoute = () => {

  console.log('entraaaa al protectedRoutes')
  const { user, isAuthenticationFetched } = useAuthContext();

  if (!isAuthenticationFetched) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <Navbar />
      <Container>
        <Outlet />
      </Container>
    </>



  );
}

export default ProtectedRoute;
