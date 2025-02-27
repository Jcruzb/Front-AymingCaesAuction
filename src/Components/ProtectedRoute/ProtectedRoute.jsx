/* eslint-disable react/prop-types */
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from '../../Contexts/AuthContext';
import Navbar from "../Navbar/Navbar";
import { Container } from "@mui/material";


const ProtectedRoute = () => {
  const { user } = useAuthContext();

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
