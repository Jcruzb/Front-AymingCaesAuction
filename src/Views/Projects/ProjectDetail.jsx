// src/Views/Projects/ProjectDetail.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stack, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getPublicProjectDetail } from '../../Services/ProjectService';
import BidForm from '../Bids/BidForm';
import BidConfirmationModal from '../Bids/BidConfirmationModal';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getPublicProjectDetail(id)
      .then(response => {
        // Se asume que response.data trae el proyecto sin el campo savingsOwner
        setProject(response);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener el proyecto:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }
  if (!project) {
    return <Typography>Proyecto no encontrado</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Detalles del proyecto */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h4">{project.title}</Typography>
          <Typography variant="subtitle1">
            <strong>Tipo de Proyecto:</strong> {project.projectType}
          </Typography>
          {project.projectType === 'Estandarizado' && (
            <Typography variant="subtitle1">
              <strong>Proyecto Estandarizado:</strong> {project.standardizedProject}
            </Typography>
          )}
          <Typography variant="subtitle1">
            <strong>Ahorro Generado:</strong> {project.savingsGenerated}
          </Typography>
          {project.attachedDocuments && project.attachedDocuments.length > 0 && (
            <Typography variant="subtitle1">
              <strong>Documentos Adjuntos:</strong> {project.attachedDocuments.join(', ')}
            </Typography>
          )}
        </Stack>
      </Paper>

      <Divider sx={{ mb: 3 }} />

      {/* Formulario para ingresar la puja */}
      <BidForm onBidSubmit={(value) => {
        setBidAmount(value);
        setModalOpen(true);
      }} />

      {/* Modal de confirmación de puja */}
      <BidConfirmationModal 
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        bidAmount={bidAmount}
        project={project}
        auctionId={project.auction[0]}
      />
    </Box>
  );
};

export default ProjectDetail;