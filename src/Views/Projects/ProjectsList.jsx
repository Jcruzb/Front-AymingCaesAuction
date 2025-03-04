import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button, Container, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProjects, deleteProject } from '../../Services/ProjectService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState({ id: false });
  const navigate = useNavigate();

  const fetchProjects = () => {
    getProjects()
      .then(response => {
        console.log(response)
        // Se asume que la respuesta contiene response.data con un arreglo de proyectos.
        const rows = response.map(project => ({
          id: project._id,
          title: project.title,
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
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (id) => {
    // Redirige al formulario de edición del proyecto
    navigate(`/projectsEditForm/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Está seguro de eliminar este proyecto?")) {
      deleteProject(id)
        .then(() => {
          fetchProjects(); // Refresca la lista
        })
        .catch(error => {
          console.error("Error al eliminar el proyecto:", error);
        });
    }
  };

  const handleAuction = (id, hasAuction) => {
    if (hasAuction) {
      // Si el proyecto ya tiene subastas, redirige a la vista de subastas
      navigate(`/projects/${id}/auctions`);
    } else {
      // Si no tiene subastas, redirige a la vista para crear una subasta
      navigate(`/projectsAuction/${id}`);
    }
  };

  if (loading) {
    return <div>Cargando proyectos...</div>;
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, hide: true },
    { field: 'title', headerName: 'Nombre del proyecto', width: 200 },
    {
      field: 'auctionStatus',
      headerName: 'Estado de la subasta',
      width: 180,
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <>
          <IconButton aria-label="editar" onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="eliminar" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
    {
      field: 'subastar',
      headerName: 'Subasta',
      width: 180,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const hasAuction = params.row.auctionStatus !== 'Sin subasta';
        return (
          <Button
            variant="contained"
            color={hasAuction ? 'secondary' : 'primary'} // Si tiene subasta, botón secundario
            onClick={() => handleAuction(params.row.id, hasAuction)}
          >
            {hasAuction ? 'Ver Subastas' : 'Subastar'}
          </Button>
        );
      },
    },
  ];

  return (
    <Container>
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
          columnVisibilityModel={columnVisibility}
          onColumnVisibilityModelChange={(newModel) =>
            setColumnVisibility(newModel)
          }
          pageSizeOptions={[5, 10]}
          disableSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>
    </Container>
  );
};

export default ProjectsList;