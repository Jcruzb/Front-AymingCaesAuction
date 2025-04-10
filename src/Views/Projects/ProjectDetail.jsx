// src/Views/Projects/ProjectDetail.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stack, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getPublicProjectDetail } from '../../Services/ProjectService';
import { getBidForAuctionAndCompany } from '../../Services/BidService';
import { useAuthContext } from '../../Contexts/AuthContext';
import BidForm from '../Bids/BidForm';
import BidConfirmationModal from '../Bids/BidConfirmationModal';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
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

  useEffect(() => {
    if (project && user && project.auction.length > 0) {
      console.log(project.auction[0]._id)
      getBidForAuctionAndCompany(project.auction[0]._id, user.company)
        .then(response => {
          setCompanyBid(response);
        })
        .catch(() => {
          setCompanyBid(null);
        });
    }
  }, [project, user]);

  const handleClose = () => {
    setModalOpen(false);
    window.location.reload();
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (!project) return <Typography>Proyecto no encontrado</Typography>;

  const auction = project.auction[0];

  return (
    <Box sx={{ p: 3 }}>
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
            <strong>Ahorro Generado:</strong> {project.savingsGenerated.toLocaleString('es-ES')} MWh
          </Typography>
          {project.attachedDocuments && project.attachedDocuments.length > 0 && (
            <Typography variant="subtitle1">
              <strong>Documentos Adjuntos:</strong> 
              {project.attachedDocuments.join(', ') || 'No se adjuntaron archivos para este proyecto'}
            </Typography>
          )}
        </Stack>
      </Paper>

      <Divider sx={{ mb: 3 }} />

      {/* SUBASTA CERRADA */}
      {auction.closed ? (
        companyBid ? (
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
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            La subasta ya ha sido cerrada y no se recibieron ofertas de tu parte. ¡Esperamos tu participación en próximas oportunidades!
          </Typography>
        )
      ) : (
        <>
          {/* SUBASTA ABIERTA */}
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
            <BidForm onBidSubmit={(value) => {
              setBidAmount(value);
              setModalOpen(true);
            }} />
          )}
        </>
      )}

      <BidConfirmationModal
        open={modalOpen}
        onClose={handleClose}
        bidAmount={bidAmount}
        project={project}
        auctionId={auction._id}
      />
    </Box>
  );
};

export default ProjectDetail;
