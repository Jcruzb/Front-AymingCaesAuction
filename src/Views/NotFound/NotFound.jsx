import { Box, Button, Typography } from "@mui/material";

const NotFound = () => {
    return (
        <Box>
        <Typography variant="h4">Ruta no encontrada (error 404)</Typography>
        <Button variant="contained" href="/">Volver al login</Button>
        </Box>
    );
    }

export default NotFound;