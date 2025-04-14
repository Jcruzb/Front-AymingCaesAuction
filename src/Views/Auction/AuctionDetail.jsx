// src/Views/Auction/AuctionDetail.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuctionDetail, norifyAuction } from '../../Services/AuctionService';
import { useAuthContext } from '../../Contexts/AuthContext';

const AuctionDetail = () => {
    const { id } = useParams();
    const { user } = useAuthContext();
    const [auction, setAuction] = useState(null);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getAuctionDetail(id)
            .then((data) => {
                setAuction(data.auction || data); // Si es usuario, data.auction contiene la info
                setBids(data.bids || data.bids); // Si es usuario, data.bids solo tendrá su puja
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener detalle de la subasta:", error);
                setLoading(false);
            });
    }, [id]);

    const notify = () => {
        norifyAuction(id)
            .then(() => { navigate('/projects') })
            .catch(() => { console.log('Error') })
    }


    if (loading) {
        return <Typography>Cargando subasta...</Typography>;
    }
    if (!auction) {
        return <Typography>Subasta no encontrada</Typography>;
    }

    // Extraer detalles del proyecto
    const { title, savingsGenerated, durationDays } = auction.project || auction;
    const createdAtValue = auction.createdAt;



    return (
        <Paper sx={{ p: 3, maxWidth: 800, margin: '20px auto' }}>
            <Stack spacing={2}>
                <Typography variant="h4">{title}</Typography>
                <Typography variant="subtitle1">
                    <strong>Ahorro Generado:</strong> {typeof savingsGenerated === 'number' ? savingsGenerated.toLocaleString('es-ES') + ' MWh' : 'N/A'}
                </Typography>
                <Typography variant="subtitle1">
                    <strong>Duración:</strong> {durationDays} día(s)
                </Typography>
                <Typography variant="subtitle1">
                    <strong>Fecha de Inicio:</strong>{' '}
                    {new Date(createdAtValue).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })}
                </Typography>
                <Typography variant="subtitle1">
                    <strong>Estado: </strong>
                    <span style={{ color: auction.closed ? 'orange' : 'green', fontWeight: 'bold' }}>
                        {auction.closed ? 'Cerrada' : 'Abierta'}
                    </span>
                </Typography>


                {/* Divider */}
                <Box sx={{ mt: 3, mb: 2, borderTop: "2px solid #ccc" }} />

                <Typography variant="h5">Pujas Registradas</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Persona que realizó la puja</strong></TableCell>
                                <TableCell><strong>Fecha de Puja</strong></TableCell>
                                <TableCell><strong>Valor de la Puja</strong></TableCell>
                                {user.role === 'administrador' && <TableCell><strong>Compañía</strong></TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bids.length > 0 ? (
                                bids.map((bid) => (
                                    <TableRow key={bid._id}>
                                        <TableCell>{bid.client?.name || "N/A"}</TableCell>
                                        <TableCell>{new Date(bid.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>{bid.bidPrice.toLocaleString('es-ES')} €/MWh</TableCell>
                                        {user.role === 'administrador' && <TableCell>{bid.company?.name || "N/A"}</TableCell>}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={user.role === 'administrador' ? 4 : 3} align="center">
                                        No hay pujas registradas.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Button variant="contained" onClick={() => navigate(-1)}>
                    Volver
                </Button>
                {auction.closed && !auction.resultsNotified ?
                    <Button variant="contained" color="warning" onClick={() => notify()}>
                        Notificar la subasta
                    </Button>
                    :
                    null
                }
            </Stack>
        </Paper>
    );
};

export default AuctionDetail;