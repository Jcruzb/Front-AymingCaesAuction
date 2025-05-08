// src/Views/Projects/ProjectDetail.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stack, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getPublicProjectDetail } from '../../Services/ProjectService';
import { getBidForAuctionAndCompany } from '../../Services/BidService';
import { useAuthContext } from '../../Contexts/AuthContext';
import BidForm from '../Bids/BidForm';
import BidConfirmationModal from '../Bids/BidConfirmationModal';
import StarIcon from '@mui/icons-material/Star';


const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [companyBids, setCompanyBids] = useState([]);

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
    if (!project || !user) return;

    const auctionExists = project.auction && project.auction.length > 0;

    if (auctionExists) {
      getBidForAuctionAndCompany(project.auction[0]._id, user.company)
        .then(response => {
          setCompanyBids(response);
        })
        .catch(() => {
          console.log('Error al obtener las pujas de la empresa');
          setCompanyBids([]);
        });
    } else {
      setCompanyBids([]);
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

  const highestBid = allBids.length > 0
    ? Math.max(...allBids.map(b => b.bidPrice))
    : null;

  const myBestBid = companyBids.length > 0
    ? companyBids.reduce((max, bid) => bid.bidPrice > max.bidPrice ? bid : max, companyBids[0])
    : null;

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

      {auction.closed ? (
        companyBids.length > 0 ? (
          <>
            <Typography variant="h6" mb={2}>Tus Pujas</Typography>
            {companyBids
              .sort((a, b) => b.bidPrice - a.bidPrice)
              .map((bid) => {
                const isBest = myBestBid && bid._id === myBestBid._id;
                return (
                  <Paper
                    key={bid._id}
                    sx={{
                      p: 3,
                      backgroundColor: isBest ? '#fff3e0' : '#f5f5f5',
                      border: isBest ? '2px solidrgb(38, 172, 255)' : 'none',
                      mb: 2,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                        <strong>Monto Ofrecido:</strong> {bid.bidPrice} €/MWh
                      </Typography>
                      {isBest && <StarIcon color="warning" titleAccess="Puja más alta realizada por tu empresa" />}
                    </Stack>
                    <Typography variant="subtitle1">
                      <strong>Fecha de Creación:</strong> {new Date(bid.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>Realizada por:</strong> {bid.client.name}
                    </Typography>
                  </Paper>
                );
              })}

          </>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            La subasta ya ha sido cerrada y no se recibieron ofertas de tu parte. ¡Esperamos tu participación en próximas oportunidades!
          </Typography>
        )
      ) : (
        <>
          {companyBids.length > 0 && (
            <>
              <Typography variant="h6" mb={2}>Tus Pujas</Typography>
              {companyBids
                .sort((a, b) => b.bidPrice - a.bidPrice)
                .map((bid) => (
                  <Paper key={bid._id} sx={{ p: 3, backgroundColor: '#f5f5f5', mb: 2 }}>
                    <Typography variant="subtitle1">
                      <strong>Monto Ofrecido:</strong> {bid.bidPrice} €/MWh
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>Fecha de Creación:</strong> {new Date(bid.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>Realizada por:</strong> {bid.client.name}
                    </Typography>
                  </Paper>
                ))}
            </>
          )}

          {(!myBestBid || myBestBid.bidPrice < highestBid) && (
            <>
              {myBestBid && (
                <Typography variant='subtitle1' color='warning.main' my={1}>
                  <strong>Tu puja fue superada</strong>
                </Typography>
              )}
              <Typography>Si deseas, puedes aumentar tu oferta:</Typography>
              <BidForm
                onBidSubmit={(value) => {
                  setBidAmount(value);
                  setModalOpen(true);
                }}
                minBid={minimumRequiredBid}
              />
            </>
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
