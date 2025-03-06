// src/Views/Projects/ProjectDetail.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stack, Divider, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getPublicProjectDetail } from '../../Services/ProjectService';
import { getBidForAuctionAndCompany } from '../../Services/BidService';
import { useAuthContext } from '../../Contexts/AuthContext';
import BidForm from '../Bids/BidForm';
import BidConfirmationModal from '../Bids/BidConfirmationModal';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuthContext(); // Se obtiene el usuario autenticado
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [companyBid, setCompanyBid] = useState(null);

  useEffect(() => {
    getPublicProjectDetail(id)
      .then(response => {
        setProject(response);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener el proyecto:', error);
        setLoading(false);
      });
  }, [id]);

  // Verificar si la compañía del usuario ya tiene una puja en la subasta
  useEffect(() => {
    if (project && user) {
      getBidForAuctionAndCompany(project.auction[0], user.company)
        .then(response => {
          console.log(response)
          setCompanyBid(response); // Si la compañía ya tiene una puja, la guardamos
        })
        .catch(() => {
          setCompanyBid(null); // Si no hay puja, se mantiene en null
        });
    }
  }, [project, user]);

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

      {/* Mostrar la puja si la compañía ya ha realizado una */}
      {companyBid ? (
        <Paper sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6">Tu Puja</Typography>
          <Typography variant="subtitle1">
            <strong>Monto Ofrecido:</strong> {companyBid.bidPrice} €/MWh
          </Typography>
          <Typography variant="subtitle1">
            <strong>Fecha de Creación:</strong> {new Date(companyBid.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Realizada por:</strong> {companyBid.client.name} 
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Formulario para ingresar la puja */}
          <BidForm onBidSubmit={(value) => {
            setBidAmount(value);
            setModalOpen(true);
          }} />
        </>
      )}

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