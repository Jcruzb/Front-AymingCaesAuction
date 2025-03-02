import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProjects } from '../../Services/ProjectService';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 }, // Mantén la columna para el manejo interno
  { field: 'savingsOwner', headerName: 'Ahorrador', width: 150 }, // Mantén la columna para el manejo interno
  { field: 'title', headerName: 'Nombre del proyecto', width: 150 },
  { field: 'savingsGenerated', headerName: 'Ahorros (MWh)', width: 150 }, // Mantén la columna para el manejo interno
  {
    field: 'auctionStatus',
    headerName: 'Estado de la subasta',
    width: 180,
  },
];

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState({ id: false }); // Estado para manejar la visibilidad

  useEffect(() => {
    getProjects()
      .then(response => {
        const rows = response.map(project => ({
          id: project._id,
          savingsOwner:project.savingsOwner,
          title: project.title,
          savingsGenerated:project.savingsGenerated,
          auctionStatus:
            project.auction && project.auction.length > 0
              ? project.auction[0].closed
                ? 'Cerrada'
                : 'Abierta'
              : 'Sin subasta',
        }));
        setProjects(rows);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener proyectos:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Cargando proyectos...</div>;
  }

  return (
    <Container sx={{ marginTop: '1vh' }}>
      <Button component={Link} to="/projectsCreateForm" variant="contained">
        Agregar Proyecto
      </Button>
      <Paper sx={{ height: 400, width: '100%', mt: 2 }}>
        <DataGrid
          rows={projects}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          columnVisibilityModel={columnVisibility} // Se oculta la columna ID
          onColumnVisibilityModelChange={(newModel) => setColumnVisibility(newModel)}
          pageSizeOptions={[5, 10]}
          disableSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>
    </Container>
  );
};

export default ProjectsList;