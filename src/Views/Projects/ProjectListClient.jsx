// src/Views/Projects/ProjectListClient.jsx
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Container, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getProjectsForClient } from '../../Services/ProjectService';

const ProjectListClient = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState({ id: false });
  const navigate = useNavigate();

  const fetchProjects = () => {
    getProjectsForClient()
      .then(response => {
        // Filtrar solo proyectos que tengan subasta (auction existe y tiene al menos un elemento)
        const rows = response
          .filter(project => project.auction && project.auction.length > 0)
          .map(project => ({
            id: project._id,
            title: project.title,
            // Suponiendo que en el endpoint de lanzamiento, cuando closed es false la subasta está abierta
            auctionStatus: project.auction[0].closed ? 'Cerrada' : 'Abierta'
          }));
        setProjects(rows);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener proyectos:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleViewDetail = (id) => {
    navigate(`/project/${id}`);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, hide: true },
    { field: 'title', headerName: 'Nombre del proyecto', width: 200 },
    { field: 'auctionStatus', headerName: 'Estado de la subasta', width: 180 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <IconButton aria-label="ver detalle" onClick={() => handleViewDetail(params.row.id)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  if (loading) {
    return <div>Cargando proyectos...</div>;
  }

  return (
    <Container>
      <Paper sx={{ height: 400, width: '100%', mt: 2 }}>
        <DataGrid
          rows={projects}
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

export default ProjectListClient;
