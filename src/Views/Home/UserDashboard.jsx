// src/Views/Dashboard/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Stack } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { getUserDashboard } from '../../Services/DashboardService';

const UserDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserDashboard()
      .then((data) => {
        console.log(data)
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener dashboard de usuario:", err);
        setLoading(false);
      });
  }, []);



  if (loading) {
    return <Typography>Cargando dashboard...</Typography>;
  }

  // Datos de ejemplo para evolución de pujas (se pueden ajustar con datos reales)
  const pujasEvolucionData = [
    { date: '2025-03-01', pujas: 2 },
    { date: '2025-03-05', pujas: 4 },
    { date: '2025-03-10', pujas: 3 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h5">Resumen de tu Participación</Typography>
          <Typography variant="subtitle1">
            <strong>Pujas Realizadas:</strong> {stats.totalBids}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Pujas Ganadas:</strong> {stats.totalWinningBids}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Monto Ganado:</strong> {stats.montoGanado.toLocaleString('es-ES')} € (sólo como ejemplo)
          </Typography>
        </Stack>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Evolución de tus Pujas (gráfica referencial)
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={pujasEvolucionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="pujas" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default UserDashboard;