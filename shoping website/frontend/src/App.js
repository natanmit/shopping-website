import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { getHomeRouteForLoggedInUser, getUserData } from './utils/Utils';
import Home from './views/Home';
import Login from './views/auth/Login';
import Register from './views/auth/Register';
import AdminLogin from './views/auth/AdminLogin';
import RequireUser from './components/RequireUser';
import AdminProducts from './views/admin/AdminProducts';
import Dashboard from './views/Dashboard';
import AdminProductCreate from './views/admin/AdminProductCreate';
import AdminProductUpdate from './views/admin/AdminProductUpdate';
import ProductItem from './views/user/ProductItem';
import UserCart from './views/user/UserCart';
import UserOrders from './views/user/UserOrders';
import Profile from './views/user/Profile';
import UserFavorites from './views/user/UserFavorites';
import OrderView from './views/user/OrderView';

const App = () => {

    const getHomeRoute = () => {
        const user = getUserData();
        if (user) {
            return <Navigate to={getHomeRouteForLoggedInUser(user.role)} replace />;
        } else {
            return <Home />;
        }
    }
    return (
        <Suspense fallback={null}>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={getHomeRoute()} />
                    <Route element={<RequireUser allowedRoles={['user']} />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="products/review/:id" element={<ProductItem />} />
                        <Route path="user-cart" element={<UserCart />} />
                        <Route path="user-orders" element={<UserOrders />} />
                        <Route path="user-orders/view/:id" element={<OrderView />} />
                        <Route path="user-favorites" element={<UserFavorites />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                    <Route element={<RequireUser allowedRoles={['admin']} />}>
                        <Route path="admin/products" element={<AdminProducts />} />
                        <Route path="admin/products/create-product" element={<AdminProductCreate />} />
                        <Route path="admin/products/update-product/:id" element={<AdminProductUpdate />} />
                    </Route>
                    
                </Route>

                <Route path="admin/login" element={<AdminLogin />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Routes>
        </Suspense>
    );
}

export default App;
