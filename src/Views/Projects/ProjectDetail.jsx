// src/Views/Projects/ProjectDetail.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stack, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import {  getPublicProjectDetail } from '../../Services/ProjectService'; // Asegúrate de tener esta función en tu servicio

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicProjectDetail(id)
      .then(response => {
        // Se asume que el endpoint devuelve el proyecto sin el campo savingsOwner
        setProject(response);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener el proyecto:', error);
        setLoading(false);
      });
  }, [id]);

  console.log(project)

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }
  if (!project) {
    return <Typography>Proyecto no encontrado</Typography>;
  }

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        p: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <Paper sx={{ maxWidth: 600, width: '100%', p: 3 }}>
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
              <strong>Documentos Adjuntos:</strong> {project.attachedDocuments.join(', ')? project.attachedDocuments.join(', '): 'No se tienen archivos adjuntos en este proyecto'}
            </Typography>
          )}
          {/* Agrega más campos según lo necesites */}
          <Button variant="contained" onClick={() => navigate(`/bid/${project.auction[0]}`)}>
            Pujar
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ProjectDetail;
