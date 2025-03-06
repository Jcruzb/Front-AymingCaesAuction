// src/Views/Auction/AuctionBidFormForClient.jsx
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import { Box, Button, TextField, Typography, Stack, Modal } from '@mui/material';
import dayjs from 'dayjs';
import { getAuction } from '../../Services/AuctionService';
import { getBidForAuctionAndCompany, createBid, updateBid } from '../../Services/BidService';
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

const AuctionBidFormForClient = () => {
  const { id: auctionId } = useParams(); // id de la subasta
  const { user } = useAuthContext(); // se asume que user.company contiene el id de la compañía
  const [auction, setAuction] = useState(null);
  const [bidData, setBidData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Cargar datos de la subasta
  useEffect(() => {
    getAuction(auctionId)
      .then(response => {
        setAuction(response);
      })
      .catch(error => {
        console.error('Error al obtener la subasta:', error);
      });
  }, [auctionId]);

  // Una vez cargada la subasta y el usuario, buscar la puja existente (si la hay)
  useEffect(() => {
    if (auction && user) {
      getBidForAuctionAndCompany(auctionId, user.company)
        .then(response => {
          // Si existe una puja, se guarda en bidData y se actualiza el formulario
          setBidData(response.data);
          formik.setFieldValue('bidAmount', response.data.bidPrice);
        })
        .catch( () => {
          // Si no se encuentra, asumimos que no hay puja previa
          setBidData(null);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auction, user, auctionId]);

  // Calcular el tiempo restante en la subasta
  useEffect(() => {
    if (auction) {
      const creationDate = dayjs(auction.createdAt);
      const endDate = creationDate.add(auction.durationDays, 'day');
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
  }, [auction]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      bidAmount: bidData ? bidData.bidPrice : '',
    },
    validationSchema: Yup.object({
      bidAmount: Yup.number()
        .typeError('Debe ser un número')
        .positive('El monto debe ser positivo')
        .required('El monto de la puja es obligatorio'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      // No se envía la puja inmediatamente, se abre el modal para confirmar
      setModalOpen(true);
      setSubmitting(false);
    },
  });

  const handleConfirmBid = () => {
    // Preparar el payload para la puja
    const bidPayload = {
      auction: auctionId,
      bidPrice: Number(formik.values.bidAmount),
      client: user.id,
      company: user.company,
    };

    // Si ya existe una puja, se actualiza; si no, se crea una nueva.
    const bidPromise = bidData
      ? updateBid(bidData.id, bidPayload)
      : createBid(bidPayload);

    bidPromise
      .then(response => {
        // Actualizamos el estado con la puja confirmada y cerramos el modal
        setBidData(response.data);
        setModalOpen(false);
      })
      .catch(error => {
        console.error("Error al enviar la puja", error);
        setModalOpen(false);
      });
  };

  if (!auction) {
    return <Typography>Cargando datos de la subasta...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Realiza tu Puja (€/MWh)
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Monto de la Puja"
            name="bidAmount"
            type="number"
            value={formik.values.bidAmount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.bidAmount && Boolean(formik.errors.bidAmount)}
            helperText={formik.touched.bidAmount && formik.errors.bidAmount}
          />
          <Button type="submit" variant="contained">
            Enviar Puja
          </Button>
        </Stack>
      </form>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="bid-modal-title"
        aria-describedby="bid-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="bid-modal-title" variant="h6">
            Confirmación de Puja
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography>
              <strong>Monto de la Puja:</strong> {formik.values.bidAmount} €/MWh
            </Typography>
            <Typography>
              <strong>Tiempo restante:</strong> {timeRemaining}
            </Typography>
            <Typography>
              Al enviar esta puja, usted declara que si en un futuro desea modificarla o desistir, deberá comunicarlo a su contacto de la empresa antes de que finalice el tiempo de la subasta.
            </Typography>
          </Stack>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleConfirmBid}>
              Confirmar Puja
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AuctionBidFormForClient;
