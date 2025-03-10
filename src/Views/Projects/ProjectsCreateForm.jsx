// src/Views/Projects/ProjectCreateForm.jsx
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Stack, TextField, Typography, MenuItem, Autocomplete } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../../Services/ProjectService'; // Debe aceptar FormData en lugar de JSON
import { getStandarProjects } from '../../Services/StandaProject';
import SaveIcon from '@mui/icons-material/Save';

const ProjectCreateForm = () => {
  const [standarProjects, setStandarProjects] = useState([]);
  const [fileLoading, setFileLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getStandarProjects()
      .then((response) => {
        setStandarProjects(response); // Se espera que contenga { _id, code, name, ... }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileLoading(true);
      // Simulación de la carga del archivo. Aquí se puede integrar la lógica real.
      setTimeout(() => {
        formik.setFieldValue('file', file);
        formik.setFieldValue('attachedDocuments', file.name);
        setFileLoading(false);
      }, 2000);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      savingsOwner: '',
      projectType: 'Singular',
      standardizedProject: '',
      savingsGenerated: '',
      attachedDocuments: '',
      file: null, // Para el archivo
      submit: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('El título es obligatorio'),
      savingsOwner: Yup.string().required('Debe ingresar el nombre del propietario inicial del ahorro'),
      projectType: Yup.string()
        .oneOf(['Singular', 'Estandarizado'], 'Tipo de proyecto inválido')
        .required('El tipo de proyecto es obligatorio'),
      standardizedProject: Yup.string().when('projectType', (projectType, schema) =>
        projectType === 'Estandarizado'
          ? schema.required('Debe seleccionar un proyecto estandarizado')
          : schema
      ),
      savingsGenerated: Yup.number()
        .typeError('Debe ser un número')
        .required('Se requiere el ahorro generado'),
      attachedDocuments: Yup.string(), // Opcional
      // "file" se valida manualmente en caso de requerirse
    }),
    onSubmit: (values, helpers) => {
      const formData = new FormData();

      formData.append('title', values.title);
      formData.append('savingsOwner', values.savingsOwner);
      formData.append('projectType', values.projectType);
      if (values.projectType === 'Estandarizado') {
        formData.append('standardizedProject', values.standardizedProject);
      }
      formData.append('savingsGenerated', values.savingsGenerated);
      formData.append('attachedDocuments', values.attachedDocuments || '');
      if (values.file) {
        formData.append('file', values.file);
      }

      createProject(formData)
        .then(() => {
          navigate('/projects');
        })
        .catch((err) => {
          helpers.setStatus({ success: false });
          helpers.setErrors({
            submit: err.response?.data?.message || 'Error creando el proyecto',
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
      <Box sx={{ maxWidth: 550, width: '100%', px: 3, py: '100px' }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h4">Crear Proyecto</Typography>
        </Stack>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Título del proyecto"
              name="title"
              value={formik.values.title || ''}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.title && formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <TextField
              fullWidth
              label="Ahorrador inicial"
              name="savingsOwner"
              value={formik.values.savingsOwner || ''}
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
              value={formik.values.projectType || 'Singular'}
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
                  formik.setFieldValue("standardizedProject", value ? value._id : "");
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params}
                    label="Proyecto estandarizado"
                    error={
                      formik.touched.standardizedProject &&
                      Boolean(formik.errors.standardizedProject)
                    }
                    helperText={
                      formik.touched.standardizedProject && formik.errors.standardizedProject
                    }
                  />
                )}
              />
            )}

            <TextField
              fullWidth
              label="Ahorro generado en MWh"
              name="savingsGenerated"
              type="number"
              value={formik.values.savingsGenerated || ''}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.savingsGenerated && formik.errors.savingsGenerated)}
              helperText={formik.touched.savingsGenerated && formik.errors.savingsGenerated}
            />
            <Stack spacing={1}>
              <Typography variant="subtitle1">Documentos Adjuntos</Typography>
              <Typography variant="caption" color="text.secondary">
                Puede cargar un archivo o adjuntar una URL
              </Typography>
              <TextField
                fullWidth
                label="URL del documento (opcional)"
                name="attachedDocuments"
                value={formik.values.attachedDocuments || ''}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={Boolean(formik.touched.attachedDocuments && formik.errors.attachedDocuments)}
                helperText={formik.touched.attachedDocuments && formik.errors.attachedDocuments}
              />
              <input
                id="file-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={() => document.getElementById('file-upload').click()}
              >
                {fileLoading ? "Loading…" : "Cargar archivo"}
              </Button>
              {formik.values.file && (
                <Typography variant="body2">
                  Archivo seleccionado: {formik.values.file.name}
                </Typography>
              )}
            </Stack>
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
