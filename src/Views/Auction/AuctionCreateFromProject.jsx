import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getProject } from '../../Services/ProjectService';
import { createAuction } from '../../Services/AuctionService';

const AuctionCreateFromProject = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // id del proyecto
    const [projectData, setProjectData] = useState(null);

    useEffect(() => {
        getProject(id)
            .then((response) => {
                // Se asume que la respuesta trae el proyecto completo
                setProjectData(response);
            })
            .catch((error) => {
                console.error('Error al obtener el proyecto:', error);
            });
    }, [id]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            project: id, // se envía el id del proyecto en el body
            durationDays: '',
            submit: null,
        },
        validationSchema: Yup.object({
            durationDays: Yup.number()
                .typeError('Debe ser un número')
                .min(1, 'La duración debe ser al menos 1 día')
                .required('La duración es obligatoria'),
        }),
        onSubmit: (values, helpers) => {
            createAuction(values)
                .then(() => {
                    navigate('/projects'); // Redirige tras crear la subasta
                })
                .catch((err) => {
                    helpers.setErrors({
                        submit: err.response?.data?.message || 'Error al crear la subasta',
                    });
                    helpers.setSubmitting(false);
                });
        },
    });

    if (!projectData) {
        return <div>Cargando datos del proyecto...</div>;
    }

    return (
        <Box
            sx={{
                backgroundColor: 'background.paper',
                flex: '1 1 auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
            }}
        >
            <Box
                sx={{
                    maxWidth: 550,
                    width: '100%',
                    px: 3,
                    py: '100px',
                }}
            >
                <Stack spacing={1} sx={{ mb: 3 }}>
                    <Typography variant="h4">Lanzar Subasta</Typography>
                </Stack>
                <form noValidate onSubmit={formik.handleSubmit}>
                    <Stack spacing={3}>
                        {/* Mostrar el nombre del proyecto (a nivel visual) */}
                        <TextField
                            fullWidth
                            label="Proyecto"
                            name="projectName"
                            value={projectData.title}
                            disabled
                        />
                        {/* Campo para la duración de la subasta */}
                        <TextField
                            fullWidth
                            label="Duración de la subasta (días)"
                            name="durationDays"
                            type="number"
                            value={formik.values.durationDays}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            error={Boolean(formik.touched.durationDays && formik.errors.durationDays)}
                            helperText={formik.touched.durationDays && formik.errors.durationDays}
                        />
                    </Stack>
                    {formik.errors.submit && (
                        <Typography color="error" sx={{ mt: 3 }} variant="body2">
                            {formik.errors.submit}
                        </Typography>
                    )}
                    <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                        Crear Subasta
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default AuctionCreateFromProject;