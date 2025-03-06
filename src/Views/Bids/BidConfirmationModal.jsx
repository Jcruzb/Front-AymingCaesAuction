// src/Views/Bids/BidConfirmationModal.jsx
import React, { useEffect, useState } from 'react';
import { Box, Modal, Typography, Button, Stack } from '@mui/material';
import dayjs from 'dayjs';
import { getAuction } from '../../Services/AuctionService';
import { createBid } from '../../Services/BidService';
import { useAuthContext } from '../../Contexts/AuthContext';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const BidConfirmationModal = ({ open, onClose, bidAmount, auctionId }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [auctionDetails, setAuctionDetails] = useState(null);
  const { user } = useAuthContext(); 


  useEffect(() => {
    if (auctionId) {
      getAuction(auctionId)
        .then(response => {
          // Se asume que la respuesta trae los detalles de la subasta en response.data
          setAuctionDetails(response);
        })
        .catch(error => {
          console.error('Error al obtener los detalles de la subasta:', error);
          setTimeRemaining('Información de subasta no disponible');
        });
    }
  }, [auctionId]);

  useEffect(() => {
    if (auctionDetails) {
      const creationDate = dayjs(auctionDetails.createdAt);
      const endDate = creationDate.add(auctionDetails.durationDays, 'day');
      const now = dayjs();
      const diff = endDate.diff(now);
      if (diff <= 0) {
        setTimeRemaining('Subasta finalizada');
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        setTimeRemaining(`${days} días, ${hours} horas`);
      }
    }
  }, [auctionDetails]);

  const handleBid = () => {
    if (!user || !user.company) {
      console.error("El usuario o la empresa no están definidos.");
      return;
    }

    const bidData = {
      auction: auctionId,
      client: user.id,
      company: user.company, // Se asume que el usuario tiene el id de la compañía en user.company
      bidPrice: bidAmount,
    };

    createBid(bidData)
      .then(() => {
        console.log("Puja realizada exitosamente.");
        onClose(); // Cerrar modal tras enviar la puja
      })
      .catch(error => {
        console.error("Error al realizar la puja:", error);
      });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="bid-modal-title"
      aria-describedby="bid-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="bid-modal-title" variant="h6">
          Confirmación de Puja
        </Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Typography>
            <strong>Monto de la Puja:</strong> {bidAmount} €/MWh
          </Typography>
          <Typography>
            <strong>Tiempo restante:</strong> {timeRemaining}
          </Typography>
          <Typography>
            Al enviar esta puja, usted declara que si en un futuro desea modificarla o desistir, deberá comunicarlo a su contacto de la empresa antes de que finalice la subasta.
          </Typography>
        </Stack>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleBid}>
            Confirmar Puja
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BidConfirmationModal;