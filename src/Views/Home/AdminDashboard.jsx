// src/Views/Dashboard/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { getAdminDashboard } from '../../Services/DashboardService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener dashboard de admin:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Typography>Cargando dashboard...</Typography>;
  }

  const auctionsByMonthData = stats.auctionsByMonth.map(item => ({
    month: item._id, // Si se necesita convertir el número del mes a nombre, se puede hacer una conversión adicional
    count: item.count
  }));

  const bidsPerAuctionData = stats.bidsPerAuction.map(item => ({
    auctionId: item._id,
    count: item.count,
    totalBidAmount: item.totalBidAmount,
    maxBid: item.maxBid
  }));

  const totalAuctions = stats.totalAuctions;
  const pieData = [
    { name: 'Subastas', value: totalAuctions },
    // Se puede agregar otra categoría si es necesario
  ];

  const COLORS = ['#0088FE', '#FFBB28'];

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5">Total de Subastas: {totalAuctions}</Typography>
        </Paper>
      </Grid>
      {/* Gráfica de barras: Subastas por mes */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Subastas por Mes
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={auctionsByMonthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      {/* Gráfica de líneas: Estadísticas de Pujas */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Estadísticas de Pujas por Subasta
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={bidsPerAuctionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="auctionId" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="maxBid" stroke="#82ca9d" name="Máxima Puja" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      {/* Gráfica de pastel: Ejemplo (opcional) */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Distribución de Subastas
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;