import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { editProject, getProject } from '../../Services/ProjectService';

const ProjectsEditForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    getProject(id)
      .then((response) => {
        // Se asume que el proyecto viene en response.data
        setInitialValues({
          title: response.title,
          projectType: response.projectType,
          savingsOwner: response.savingsOwner,
          standardizedProject: response.standardizedProject || '',
          savingsGenerated: response.savingsGenerated,
          attachedDocuments: response.attachedDocuments?.join(', ') || '',
          submit: null,
        });
      })
      .catch((error) => {
        console.error('Error al obtener los datos del proyecto:', error);
      });
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues || {
      title: '',
      projectType: 'Singular',
      savingsOwner: '',
      standardizedProject: '',
      savingsGenerated: '',
      attachedDocuments: '',
      submit: null,
    },
    validationSchema: Yup.object({
        title: Yup.string().required('El título del proyecto es obligatorio'),
        projectType: Yup.string()
          .oneOf(['Singular', 'Estandarizado'], 'Tipo de proyecto inválido')
          .required('El tipo de proyecto es obligatorio'),
        savingsOwner: Yup.string().required('Debe ingresar el propietario del ahorro'),
        standardizedProject: Yup.string().when('projectType', (projectType, schema) => {
          return projectType === 'Estandarizado'
            ? schema.required('Debe seleccionar un proyecto estandarizado')
            : schema.notRequired();
        }),
        savingsGenerated: Yup.number()
          .typeError('Debe ser un número')
          .required('Se requiere el ahorro generado'),
        attachedDocuments: Yup.string(),
      }),
    onSubmit: (values, helpers) => {
      const projectData = {
        ...values,
        attachedDocuments: values.attachedDocuments
          ? values.attachedDocuments.split(',').map((doc) => doc.trim())
          : [],
        savingsGenerated: Number(values.savingsGenerated),
      };

      editProject(id, projectData)
        .then(() => {
          navigate('/projects'); // Redirige a la lista de proyectos tras la actualización
        })
        .catch((err) => {
          helpers.setErrors({
            submit: err.response?.data?.message || 'Error al actualizar el proyecto',
          });
          helpers.setSubmitting(false);
        });
    },
  });

  if (!initialValues) {
    return <div>Cargando datos del proyecto...</div>;
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
          <Typography variant="h4">Editar Proyecto</Typography>
        </Stack>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Título del Proyecto"
              name="title"
              value={formik.values.title}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.title && formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <TextField
              select
              fullWidth
              label="Tipo de Proyecto"
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
              <TextField
                fullWidth
                label="Proyecto Estandarizado"
                name="standardizedProject"
                value={formik.values.standardizedProject}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={Boolean(formik.touched.standardizedProject && formik.errors.standardizedProject)}
                helperText={formik.touched.standardizedProject && formik.errors.standardizedProject}
              />
            )}
            <TextField
              fullWidth
              label="Propietario del Ahorro"
              name="savingsOwner"
              value={formik.values.savingsOwner}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.savingsOwner && formik.errors.savingsOwner)}
              helperText={formik.touched.savingsOwner && formik.errors.savingsOwner}
            />
            <TextField
              fullWidth
              label="Ahorro Generado"
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
              label="Documentos Adjuntos (separados por coma)"
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
            Actualizar Proyecto
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ProjectsEditForm;