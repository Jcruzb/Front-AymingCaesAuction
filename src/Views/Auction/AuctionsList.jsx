// src/Views/Auction/AuctionsList.jsx
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Container, Paper, Button } from '@mui/material';
import TimeRemainingCell from '../../Components/TimeRemaingCell/TimeRemainingCell';
import { getAuctions, closeAuction } from '../../Services/AuctionService';

const AuctionsList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState({ id: false });

  const fetchAuctions = () => {
    getAuctions()
      .then(response => {
        // Se asume que cada subasta tiene: _id, createdAt, durationDays y project (populado con title y savingsGenerated)
        const rows = response.map(auction => ({
          id: auction._id,
          projectTitle: auction.project ? auction.project.title : 'N/A',
          savings: auction.project ? auction.project.savingsGenerated : 'N/A',
          createdAt: auction.createdAt,
          durationDays: auction.durationDays,
          closed: auction.closed,
        }));
        setAuctions(rows);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener subastas:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handleCloseAuction = (auctionId) => {
    if (window.confirm("¿Está seguro de cerrar la subasta?")) {
      closeAuction(auctionId)
        .then(() => {
          fetchAuctions(); // Refrescar la lista tras cerrar la subasta
        })
        .catch(error => {
          console.error("Error al cerrar la subasta:", error);
        });
    }
  };

  if (loading) {
    return <div>Cargando subastas...</div>;
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, hide: true },
    { field: 'projectTitle', headerName: 'Proyecto', width: 200 },
    { 
      field: 'savings', 
      headerName: 'Ahorro Generado', 
      width: 150,
      valueFormatter: ({ value }) => typeof value === 'number' ? value.toLocaleString('es-ES') + ' MWh' : value,
    },
    {
      field: 'timeRemaining',
      headerName: 'Tiempo Restante',
      width: 200,
      renderCell: (params) => (
        <TimeRemainingCell 
          createdAt={params.row.createdAt} 
          durationDays={params.row.durationDays} 
        />
      ),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 200,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Button variant="contained" color="error" onClick={() => handleCloseAuction(params.row.id)}>
          Cerrar Subasta
        </Button>
      ),
    },
  ];

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={auctions}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          columnVisibilityModel={columnVisibility}
          onColumnVisibilityModelChange={(newModel) => setColumnVisibility(newModel)}
          pageSizeOptions={[5, 10]}
          disableSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>
    </Container>
  );
};

export default AuctionsList;