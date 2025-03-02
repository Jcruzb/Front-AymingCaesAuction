import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button, Container } from '@mui/material';
import { Link } from 'react-router-dom'; // Importa Link de react-router-dom

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Nombre del proyecto', width: 200 },
    {
        field: 'auctionStatus',
        headerName: 'Estado de la subasta',
        width: 180,

    },
];

// Datos de ejemplo para la tabla. En una implementación real, estos datos vendrían del backend.
const rows = [
    { id: 1, title: 'Proyecto Alpha', auction: true },
    { id: 2, title: 'Proyecto Beta', auction: false },
    { id: 3, title: 'Proyecto Gamma', auction: true },
];

const ProjectsList = () => {


    return (
        <Container>


            <Button component={Link} to="/projectsCreateForm" variant="contained">
                Agregar Proyecto
            </Button>

            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    sx={{ border: 0 }}
                />
            </Paper>
        </Container>
    );
}

export default ProjectsList