// src/Views/Projects/ProjectCreateForm.jsx
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography, MenuItem, Autocomplete } from '@mui/material';
import { createProject } from '../../Services/ProjectService'; // Asegúrate de tener implementada esta función
import { useEffect, useState } from 'react';
import { getStandarProjects } from '../../Services/StandaProject';

const ProjectCreateForm = () => {
  const [standarProjects, setStandarProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getStandarProjects()
      .then((response) => {
        setStandarProjects(response); // Se espera que response sea un array de proyectos estándar con propiedades: id, code, name, etc.
      })
      .catch((err) => console.log(err));
  }, []);

  const formik = useFormik({
    initialValues: {
      title: '',
      savingsOwner: '',
      projectType: 'Singular',
      standardizedProject: '', // Aquí se guardará el id del proyecto estándar seleccionado
      savingsGenerated: '',
      attachedDocuments: '', // Puedes ingresar URLs o nombres separados por coma
      submit: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('El título es obligatorio'),
      savingsOwner: Yup.string().required('Debe ingresar el nombre del propietario inicial del ahorro'),
      projectType: Yup.string()
        .oneOf(['Singular', 'Estandarizado'], 'Tipo de proyecto inválido')
        .required('El tipo de proyecto es obligatorio'),
      standardizedProject: Yup.string().when('projectType', (projectType, schema) => {
        return projectType === 'Estandarizado'
          ? schema.required('Se requiere seleccionar un proyecto estandarizado')
          : schema;
      }),
      savingsGenerated: Yup.number()
        .typeError('Debe ser un número')
        .required('Se requiere el ahorro generado'),
      attachedDocuments: Yup.string(), // Opcional
    }),
    onSubmit: (values, helpers) => {
      // Si el proyecto no es estandarizado, eliminamos el campo standardizedProject
      const projectData = { ...values };
      if (projectData.projectType !== 'Estandarizado') {
        delete projectData.standardizedProject;
      }
      console.log(projectData);
      createProject(projectData)
        .then(() => {
          navigate('/projects'); // Redirige a la lista o detalle de proyectos
        })
        .catch((err) => {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.response?.data?.message || 'Error creando el proyecto' });
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
          <Typography variant="h4">Crear Proyecto</Typography>
        </Stack>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Título del proyecto"
              name="title"
              value={formik.values.title}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.title && formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <TextField
              fullWidth
              label="Ahorrador inicial"
              name="savingsOwner"
              value={formik.values.savingsOwner}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.savingsOwner && formik.errors.savingsOwner)}
              helperText={formik.touched.savingsOwner && formik.errors.savingsOwner}
            />
            <TextField
              select
              fullWidth
              label="Tipo de proyecto"
              name="projectType"
              value={formik.values.projectType}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.projectType && formik.errors.projectType)}
              helperText={formik.touched.projectType && formik.errors.projectType}
            >
              <MenuItem value="Singular">Singular</MenuItem>
              <MenuItem value="Estandarizado">Estandarizado</MenuItem>
            </TextField>
            {formik.values.projectType === 'Estandarizado' && (
              <Autocomplete
                options={standarProjects}
                getOptionLabel={(option) => `${option.code} ${option.name}`}
                onChange={(event, value) => {
                  // Guarda el id del proyecto estándar seleccionado
                  formik.setFieldValue("standardizedProject", value ? value._id : "");
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params}
                    label="Proyecto estandarizado"
                    error={formik.touched.standardizedProject && Boolean(formik.errors.standardizedProject)}
                    helperText={formik.touched.standardizedProject && formik.errors.standardizedProject}
                  />
                )}
              />
            )}
            <TextField
              fullWidth
              label="Ahorro generado en MWh"
              name="savingsGenerated"
              type="number"
              value={formik.values.savingsGenerated}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.savingsGenerated && formik.errors.savingsGenerated)}
              helperText={formik.touched.savingsGenerated && formik.errors.savingsGenerated}
            />
            <TextField
              fullWidth
              label="Documentos adjuntos (separados por coma)"
              name="attachedDocuments"
              value={formik.values.attachedDocuments}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.attachedDocuments && formik.errors.attachedDocuments)}
              helperText={formik.touched.attachedDocuments && formik.errors.attachedDocuments}
            />
          </Stack>
          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
          <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
            Crear Proyecto
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ProjectCreateForm;
