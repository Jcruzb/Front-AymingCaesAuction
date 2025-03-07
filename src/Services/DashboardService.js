import createHttp from './BaseService';

const http = createHttp(true);

export const getAdminDashboard = () => http.get('/dashboard/admin')
export const getUserDashboard = () => http.get('/dashboard/user')