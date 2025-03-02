import createHttp from './BaseService';

const http = createHttp(true);

export const createCompany = (companyData) => http.post('/companies/', companyData);
export const getCompanies = () => http.get('/companies/')
export const getCompany = (id) => http.get(`/companies/${id}`) 
export const editCompany = (id) => http.put(`/companies/${id}`) 
export const deleteCompany = (id) => http.delete(`/companies/${id}`) 