// src/Views/Auction/AuctionsList.jsx
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Container, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TimeRemainingCell from '../../Components/TimeRemaingCell/TimeRemainingCell';
import { getAuctions, closeAuction } from '../../Services/AuctionService';

const AuctionsList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState({ id: false });
  const navigate = useNavigate();

  const fetchAuctions = () => {
    getAuctions()
      .then(response => {
          console.log(response)
        const rows = response.map(auction => ({
          id: auction._id,
          projectTitle: auction.project ? auction.project.title : 'N/A',
          projectId: auction.project ? auction.project._id : 'N/A',
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
      renderCell: (params) => {
        if (params.row.closed) {
          return <span>0h 0m 0s</span>;
        } else {
          return <TimeRemainingCell 
                   createdAt={params.row.createdAt} 
                   durationDays={params.row.durationDays} 
                 />;
        }
      },
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 200,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log(params.row.projectId)
        if (params.row.closed) {
          return (
            <Button variant="contained" color="primary" onClick={() => navigate(`/auction/detail/${params.row.id}`)}>
              Ver detalle
            </Button>
          );
        } else {
          return (
            <Button variant="contained" color="error" onClick={() => handleCloseAuction(params.row.id)}>
              Cerrar Subasta
            </Button>
          );
        }
      },
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