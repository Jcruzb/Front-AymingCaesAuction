import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button, Container, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCompanies, deleteCompany } from '../../Services/CompanyService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState({ id: false });
  const navigate = useNavigate();

  // Función para traer las compañías del backend
  const fetchCompanies = () => {
    getCompanies()
      .then((response) => {
        // Se asume que las compañías vienen en response.data
        const rows = response.map((company) => ({
          id: company.id, // DataGrid requiere un campo id, aunque se oculte
          name: company.name,
          NifCif: company.NifCif,
        }));
        setCompanies(rows);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener compañías:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Maneja la edición redirigiendo al formulario de edición
  const handleEdit = (id) => {
    navigate(`/companiesEditForm/${id}`);
  };

  // Maneja la eliminación mostrando una confirmación y refrescando la lista
  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de eliminar esta compañía?')) {
      deleteCompany(id)
        .then(() => {
          fetchCompanies();
        })
        .catch((error) => {
          console.error('Error al eliminar la compañía:', error);
        });
    }
  };

  // Se definen las columnas, incluida la de "Acciones"
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nombre', width: 200 },
    { field: 'NifCif', headerName: 'CIF', width: 150 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="editar"
            onClick={() => handleEdit(params.row.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="eliminar"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  if (loading) {
    return <div>Cargando compañías...</div>;
  }

  return (
    <Container sx={{ marginTop: '1vh' }}>
      <Button component={Link} to="/companiesCreateForm" variant="contained">
        Agregar Compañía
      </Button>
      <Paper sx={{ height: 400, width: '100%', mt: 2 }}>
        <DataGrid
          rows={companies}
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

export default CompanyList;