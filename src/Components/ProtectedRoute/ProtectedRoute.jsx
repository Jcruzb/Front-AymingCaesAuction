import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from '../../Contexts/AuthContext';
import Navbar from "../Navbar/Navbar";
import { Container } from "@mui/material";


const ProtectedRoute = () => {

  const { user, isAuthenticationFetched } = useAuthContext();

  if (!isAuthenticationFetched) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/" />
  }

  return (
    <>
      <Navbar />
      <Container sx={{marginTop:'14vh'}}>
        <Outlet />
      </Container>
    </>



  );
}

export default ProtectedRoute;
