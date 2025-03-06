// src/Views/Users/CreateUserForm.jsx
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Stack, TextField, Typography, MenuItem } from '@mui/material';
import { createUser } from '../../Services/UserService';
import { getCompanies } from '../../Services/CompanyService';

const CreateUserForm = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompanies()
      .then((data) => {
        setCompanies(data); // Como axios retorna data ya filtrada por el interceptor, no es necesario response.data
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener compañías:', error);
        setLoading(false);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      company: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, 'Mínimo 3 caracteres')
        .max(50, 'Máximo 50 caracteres')
        .required('Se requiere un nombre'),
      email: Yup.string()
        .email('Formato de email inválido')
        .required('Se requiere un email'),
      password: Yup.string()
        .min(8, 'La contraseña debe tener mínimo 8 caracteres')
        .required('Se requiere la contraseña'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
        .required('Confirma tu contraseña'),
      company: Yup.string().required('Selecciona la compañía a la que perteneces'),
    }),
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      createUser(values)
        .then(() => {
          resetForm();
          setSubmitting(false);
          // Aquí podrías redirigir o mostrar un mensaje de éxito
        })
        .catch((error) => {
          setErrors({ submit: error.message });
          setSubmitting(false);
        });
    },
  });

  if (loading) {
    return <Typography>Cargando compañías...</Typography>;
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
          <Typography variant="h4">Crear Usuario</Typography>
        </Stack>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Nombre"
              name="name"
              value={formik.values.name}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.name && formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formik.values.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.email && formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.password && formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <TextField
              fullWidth
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
            <TextField
              select
              fullWidth
              label="Compañía"
              name="company"
              value={formik.values.company}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.company && formik.errors.company)}
              helperText={formik.touched.company && formik.errors.company}
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
          <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
            Crear Usuario
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default CreateUserForm;