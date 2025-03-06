// src/Views/Auction/AuctionModal.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { lauchAuction } from '../../Services/AuctionService';
import { useNavigate } from 'react-router';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const AuctionModal = ({ open, onClose, auction, project, id }) => {

const navigate = useNavigate()

const handleLaunchAuction = () => {
    lauchAuction(id, project).
    then(() => navigate('/home'))
    .catch((err) => console.log(err))
}

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="auction-modal-title"
      aria-describedby="auction-modal-description"
    >
      <Box sx={style}>
        <Typography id="auction-modal-title" variant="h6" component="h2">
          Detalles de la Subasta
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography>
            <strong>Proyecto:</strong> {project.title}
          </Typography>
          <Typography>
            <strong>Tipo de Proyecto:</strong> {project.projectType}
          </Typography>
          {project.projectType === 'Estandarizado' && (
            <Typography>
              <strong>Proyecto Estandarizado:</strong> {project.standardizedProject}
            </Typography>
          )}
          <Typography>
            <strong>Ahorro Generado:</strong> {project.savingsGenerated}
          </Typography>
          <Typography>
            <strong>Duración (días):</strong> {auction.durationDays}
          </Typography>
        </Box>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleLaunchAuction}>
            Lanzar Subasta
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AuctionModal;
