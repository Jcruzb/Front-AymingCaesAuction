import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { editCompany, getCompany } from '../../Services/CompanyService';

const CompanyEditForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    getCompany(id)
      .then((response) => {
        // Se asume que la compañía viene en response.data
        setInitialValues({
          name: response.name,
          NifCif: response.NifCif,
          submit: null,
        });
      })
      .catch((error) => {
        console.error('Error al obtener los datos de la compañía:', error);
      });
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues || { name: '', NifCif: '', submit: null },
    validationSchema: Yup.object({
      name: Yup.string().required('El nombre de la compañía es obligatorio'),
      NifCif: Yup.string(), // Puedes agregar validaciones adicionales si lo requieres
    }),
    onSubmit: (values, helpers) => {
        editCompany(id, values)
        .then(() => {
          navigate('/companies'); // Redirige a la lista de compañías tras la actualización
        })
        .catch((err) => {
          helpers.setErrors({
            submit: err.response?.message || 'Error al actualizar la compañía',
          });
          helpers.setSubmitting(false);
        });
    },
  });

  if (!initialValues) {
    return <div>Cargando datos de la compañía...</div>;
  }

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        flex: '1 1 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 550,
          width: '100%',
          px: 3,
          py: '100px',
        }}
      >
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h4">Editar Compañía</Typography>
        </Stack>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Nombre de la compañía"
              name="name"
              value={formik.values.name}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.name && formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              label="CIF"
              name="NifCif"
              value={formik.values.NifCif}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.NifCif && formik.errors.NifCif)}
              helperText={formik.touched.NifCif && formik.errors.NifCif}
            />
          </Stack>
          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
          <Button
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            type="submit"
            variant="contained"
          >
            Actualizar Compañía
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default CompanyEditForm;