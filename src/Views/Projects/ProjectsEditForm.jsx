// src/Views/Projects/ProjectsEditForm.jsx
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography, MenuItem, Autocomplete } from '@mui/material';
import { useEffect, useState } from 'react';
import { editProject, getProject } from '../../Services/ProjectService';
import { getStandarProjects } from '../../Services/StandaProject';
import SaveIcon from '@mui/icons-material/Save';

const ProjectsEditForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [standarProjects, setStandarProjects] = useState([]);
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    getProject(id)
      .then((response) => {
        // Se verifica que attachedDocuments tenga elementos; de lo contrario se asigna una cadena vacía
        setInitialValues({
          title: response.title || '',
          projectType: response.projectType || 'Singular',
          savingsOwner: response.savingsOwner || '',
          standardizedProject: response.standardizedProject || '',
          attachedDocuments:
            response.attachedDocuments && response.attachedDocuments.length > 0
              ? response.attachedDocuments[0]
              : '',
          savingsGenerated: response.savingsGenerated || '',
          submit: null,
        });
      })
      .then(() => {
        getStandarProjects()
          .then((response) => {
            setStandarProjects(response);
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        console.error('Error al obtener los datos del proyecto:', error);
      });
  }, [id]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileLoading(true);
      // Simulación de subida del archivo; reemplaza esta lógica por la real según tu integración
      setTimeout(() => {
        const uploadedFileUrl = file.name; // Ejemplo: se utiliza el nombre del archivo
        formik.setFieldValue("attachedDocuments", uploadedFileUrl);
        setFileLoading(false);
      }, 2000);
    }
  };

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
        // Se convierte a arreglo el valor de attachedDocuments si se definió
        attachedDocuments: values.attachedDocuments ? [values.attachedDocuments] : [],
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
              value={formik.values.title || ''}
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
                value={
                  standarProjects.find(
                    (item) => item._id === formik.values.standardizedProject
                  ) || null
                }
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
              label="Propietario del Ahorro"
              name="savingsOwner"
              value={formik.values.savingsOwner || ''}
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
            </Stack>
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
