// src/Views/Users/UserList.jsx
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Container, Paper, Button, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteUser, getUsersList } from '../../Services/UserService';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState({ id: false });
  const navigate = useNavigate();

  const fetchUsers = () => {
    getUsersList()
      .then(response => {
        // Se asume que el interceptor de axios retorna los datos ya en response (sin .data)
        const rows = response.map(user => ({
          id: user.id, // o user._id según como lo configures en el modelo
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company && user.company.name ? user.company.name : '',
        }));
        setUsers(rows);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener usuarios:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (id) => {
    navigate(`/usersEditForm/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      deleteUser(id)
        .then(() => {
          fetchUsers(); // Actualiza la lista
        })
        .catch(error => {
          console.error('Error al eliminar el usuario:', error);
        });
    }
  };

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, hide: true },
    { field: 'name', headerName: 'Nombre', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'role', headerName: 'Rol', width: 150 },
    { field: 'company', headerName: 'Compañía', width: 200 },
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
  ];

  return (
    <Container sx={{ mt: 3 }}>
      <Button component={Link} to="/usersCreateForm" variant="contained">
        Agregar Usuario
      </Button>
      <Paper sx={{ height: 400, width: '100%', mt: 2 }}>
        <DataGrid
          rows={users}
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

export default UserList;