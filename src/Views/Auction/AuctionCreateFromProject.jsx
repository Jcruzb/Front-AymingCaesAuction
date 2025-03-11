// src/Views/Auction/AuctionCreateFromProject.jsx
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getProject } from '../../Services/ProjectService';
import { createAuction, launchAuction, editAuction } from '../../Services/AuctionService'; 
import AuctionModal from './AuctionModal';

const AuctionCreateFromProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [auctionData, setAuctionData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    getProject(id)
      .then((response) => {
        setProjectData(response);
        console.log(response)
        if (response.auction && response.auction.length > 0) {
          setAuctionData(response.auction[0]);
        }
      })
      .catch((error) => {
        console.error('Error al obtener el proyecto:', error);
      });
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      project: id,
      durationDays: auctionData?.durationDays || '',
      submit: null,
    },
    validationSchema: Yup.object({
      durationDays: Yup.number()
        .typeError('Debe ser un número')
        .min(1, 'La duración debe ser al menos 1 día')
        .required('La duración es obligatoria'),
    }),
    onSubmit: (values, helpers) => {
      if (auctionData) {
        // Si ya existe la subasta, actualizamos los días por si fueron modificados
        const updatedAuction = {
          ...auctionData,
          durationDays: values.durationDays,
        };
    
        editAuction(auctionData._id, updatedAuction)
          .then((updated) => {
            setAuctionData(updated); // Actualiza los datos con lo nuevo
            setModalOpen(true);
            helpers.setSubmitting(false);
          })
          .catch((err) => {
            helpers.setErrors({
              submit: err.response?.data?.message || 'Error al actualizar la subasta',
            });
            helpers.setSubmitting(false);
          });
      } else {
        // Crear nueva subasta
        createAuction(values)
          .then((response) => {
            setAuctionData(response);
            setModalOpen(true);
            helpers.setSubmitting(false);
          })
          .catch((err) => {
            helpers.setErrors({
              submit: err.response?.data?.message || 'Error al crear la subasta',
            });
            helpers.setSubmitting(false);
          });
      }
    },    
  });

    console.log(!auctionData)

  if (!projectData) {
    return <div>Cargando datos del proyecto y subasta...</div>;
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
      <Box sx={{ maxWidth: 550, width: '100%', px: 3, py: '100px' }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h4">
            {auctionData ? 'Lanzar Subasta' : 'Crear Subasta'}
          </Typography>
        </Stack>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            {/* Muestra el nombre del proyecto (solo a nivel visual) */}
            <TextField
              fullWidth
              label="Proyecto"
              name="projectName"
              value={projectData.title}
              disabled
            />
            {/* Campo para la duración */}
            <TextField
              fullWidth
              label="Duración de la subasta (días)"
              name="durationDays"
              type="number"
              value={formik.values.durationDays}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={
                Boolean(formik.touched.durationDays && formik.errors.durationDays)
              }
              helperText={
                formik.touched.durationDays && formik.errors.durationDays
              }
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
            color={auctionData ? 'success' : 'primary'}
          >
            {auctionData ? 'Lanzar Subasta' : 'Crear Subasta'}
          </Button>
        </form>
        {auctionData && (
          <AuctionModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            auction={auctionData}
            project={projectData}
            onConfirm={() => {
              // Llama al endpoint de lanzamiento y redirige a /auctions si tiene éxito
              launchAuction(auctionData._id, projectData)
                .then(() => navigate('/auctions'))
                .catch((err) =>
                  console.error('Error al lanzar la subasta:', err)
                );
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default AuctionCreateFromProject;
