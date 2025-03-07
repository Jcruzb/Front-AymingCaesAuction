import { useAuthContext } from '../../Contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const Home = () => {
    const { user } = useAuthContext();

    return (
        <>
            {
                user.role === 'administrador'
                    ?
                    <AdminDashboard />
                    :
                    <UserDashboard />

            }

        </>
    )
}

export default Home