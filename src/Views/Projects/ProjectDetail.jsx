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
        console.log(response);

        setProject(response);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener el proyecto:', error);
        setLoading(false);
      });
  }, [id]);

  console.log(project)

  useEffect(() => {
    if (!project || !user) return;

    const auctionExists = project.auction && project.auction.length > 0;

    if (auctionExists) {
      getBidForAuctionAndCompany(project.auction[0]._id, user.company)
        .then(response => {
          setCompanyBid(response);
        })
        .catch(() => {
          console.log('Error al obtener la puja de la empresa');
          setCompanyBid(null);
        });
    } else {
      // Si no hay subasta, aseguramos que no haya puja
      setCompanyBid(null);
    }
  }, [project, user]);


  const handleClose = () => {
    setModalOpen(false);
    window.location.reload();
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (!project) return <Typography>Proyecto no encontrado</Typography>;

  const auction = project.auction[0];
  const allBids = auction.bids || [];

  // Obtener la puja máxima actual
  const highestBid = allBids.length > 0
    ? Math.max(...allBids.map(b => b.bidPrice))
    : null;

  // Calcular el mínimo requerido para la nueva puja
  const minimumRequiredBid = highestBid !== null
    ? highestBid + auction.minBidIncrement
    : auction.minBid + auction.minBidIncrement;

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
              <strong>Proyecto Estandarizado:</strong> {`${project.standardizedProject.code} - ${project.standardizedProject.name}`}
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
            <BidForm
              onBidSubmit={(value) => {
                setBidAmount(value);
                setModalOpen(true);
              }}
              minBid={minimumRequiredBid} // ← ya es el valor requerido final
            />

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
