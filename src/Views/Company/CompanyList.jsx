import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCompanies } from '../../Services/CompanyService'; // Asegúrate de tener esta función implementada

const columns = [
  { field: 'id', headerName: 'ID', width: 70 }, // Se mantiene para el manejo interno, se ocultará visualmente
  { field: 'name', headerName: 'Nombre', width: 200 },
  { field: 'NifCif', headerName: 'CIF', width: 150 },
];

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState({ id: false }); // Estado para ocultar la columna ID

  useEffect(() => {
    getCompanies()
      .then(response => {
        console.log(response)
        // Se asume que las compañías vienen en response.data
        const rows = response.map(company => ({
          id: company.id, 
          name: company.name,
          NifCif: company.NifCif,
        }));
        setCompanies(rows);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener compañías:', error);
        setLoading(false);
      });
  }, []);

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
          onColumnVisibilityModelChange={(newModel) => setColumnVisibility(newModel)}
          pageSizeOptions={[5, 10]}
          disableSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>
    </Container>
  );
};

export default CompanyList;