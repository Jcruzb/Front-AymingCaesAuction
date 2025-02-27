import createHttp from './BaseService';

const http = createHttp(true);

export const getCurrentUser = () => http.get('/users/me');
export const getUsersList = () => http.get('/users/');
export const updateUser = (id, user) => http.put(`/users/${id}`, user);
export const createUser = (user) => http.post('/users/register', user);
export const getUser = (id) => http.get(`/users/${id}`);
export const getAllOfUser = () => http.get(`/users/users`);
export const deleteUser = (id) => http.delete(`/users/${id}`);