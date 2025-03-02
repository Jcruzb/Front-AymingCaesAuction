import createHttp from './BaseService';

const http = createHttp(true);

export const createProject = () => http.post('/project/');
export const getProjects = () => http.get('/projects/')
export const getProject = (id) => http.get(`/project/${id}`) 
export const editProject = (id) => http.put(`/project/${id}`) 
export const deleteProject = (id) => http.delete(`/project/${id}`) 