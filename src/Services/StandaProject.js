import createHttp from './BaseService';

const http = createHttp(true);

export const getStandarProjects = () => http.get('/standarProjects/')