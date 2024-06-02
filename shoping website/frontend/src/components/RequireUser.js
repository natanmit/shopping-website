import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import FullScreenLoader from './FullScreenLoader';
import { getMeAPI } from '../redux/api/getMeAPI';

const RequireUser = ({ allowedRoles }) => {
    const [cookies] = useCookies(['isLoggedIn']);
    
    const location = useLocation();
    const { isLoading, isFetching } = getMeAPI.endpoints.getMe.useQuery(null, {
        skip: false,
        refetchOnMountOrArgChange: true,
    });
    const loading = isLoading || isFetching;

    const userResult = getMeAPI.endpoints.getMe.useQueryState(null, {
        selectFromResult: ({ data }) => data,
    });
    const user = userResult ? userResult : null; // Handling potential undefined user result

    if (loading) {
        return <FullScreenLoader />;
    }

    const hasAccess = (cookies.isLoggedIn || user) && allowedRoles.includes(user.role);

    if (hasAccess) {
        return <Outlet />;
    } else if (cookies.isLoggedIn && user) {
        return <Navigate to='/unauthorized' state={{ from: location }} replace />;
    } else {
        return <Navigate to='/login' state={{ from: location }} replace />;
    }
};

export default RequireUser;
