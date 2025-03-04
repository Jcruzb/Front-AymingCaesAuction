import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { createCompany } from '../../Services/CompanyService';

const CompanyCreateForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      NifCif: '',
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('El nombre de la compañía es obligatorio'),
      NifCif: Yup.string(), // Puedes agregar más validaciones si lo necesitas
    }),
    onSubmit: (values, helpers) => {
      createCompany(values)
        .then(() => {
          navigate('/companies'); // Redirige a la lista de compañías
        })
        .catch((err) => {
          helpers.setErrors({
            submit: err.response?.data?.message || 'Error al crear la compañía',
          });
          helpers.setSubmitting(false);
        });
    },
  });

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
          <Typography variant="h4">Crear Compañía</Typography>
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
          <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
            Crear Compañía
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default CompanyCreateForm;