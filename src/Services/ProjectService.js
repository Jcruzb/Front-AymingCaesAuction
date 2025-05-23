import createHttp from './BaseService';

const http = createHttp(true);

export const createProject = (projectData) => http.post('/project/', projectData);
export const getProjects = () => http.get('/project/')
export const getProject = (id) => http.get(`/project/${id}`) 
export const getProjectsForClient = () => http.get('/project/public') 
export const editProject = (id, body) => http.put(`/project/${id}`, body) 
export const deleteProject = (id) => http.delete(`/project/${id}`) 
export const getPublicProjectDetail = (id) => http.get(`/project/public/${id}`)