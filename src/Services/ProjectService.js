import createHttp from './BaseService';

const http = createHttp(true);

export const createProject = (projectData) => http.post('/project/', projectData);
export const getProjects = () => http.get('/project/')
export const getProject = (id) => http.get(`/project/${id}`) 
export const editProject = (id) => http.put(`/project/${id}`) 
export const deleteProject = (id) => http.delete(`/project/${id}`) 