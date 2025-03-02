import createHttp from './BaseService';

const http = createHttp(true);

export const getCurrentUser = () => http.get('/user/me');
export const getUsersList = () => http.get('/user/');
export const updateUser = (id, user) => http.put(`/user/${id}`, user);
export const createUser = (user) => http.post('/user/register', user);
export const getUser = (id) => http.get(`/user/${id}`);
export const getAllOfUser = () => http.get(`/user/users`);
export const deleteUser = (id) => http.delete(`/user/${id}`);