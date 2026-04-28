import Home from '../pages/Home';
import Orders from '../pages/Orders';
import CustomerOrdersPage from '../pages/CustomerOrdersPage';
import Delivery from '../pages/Delivery';
import DeliveryReportPage from '../pages/DeliveryReportPage';
import AccountOwnerDeliveryReportPage from '../pages/AccountOwnerDeliveryReportPage';
import AllOrdersViewPage from '../pages/AllOrdersViewPage';
import RoleBasedDelivery from '../components/RoleBasedDelivery';
import RoleBasedOrders from '../components/RoleBasedOrders';
import Login from '../components/Login';
import Register from '../components/Register';
import ProtectedRoute from '../components/ProtectedRoute';

export const routes = [
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/orders',
        element: (
            <ProtectedRoute>
                <RoleBasedOrders />
            </ProtectedRoute>
        ),
    },
    {
        path: '/customer-orders',
        element: (
            <ProtectedRoute>
                <CustomerOrdersPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/orders-management',
        element: (
            <ProtectedRoute>
                <Orders />
            </ProtectedRoute>
        ),
    },
    {
        path: '/delivery',
        element: (
            <ProtectedRoute>
                <RoleBasedDelivery />
            </ProtectedRoute>
        ),
    },
    {
        path: '/delivery-management',
        element: (
            <ProtectedRoute>
                <Delivery />
            </ProtectedRoute>
        ),
    },
    {
        path: '/reports', 
        element: (
            <ProtectedRoute>
                <DeliveryReportPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/my-reports',
        element: (
            <ProtectedRoute>
                <AccountOwnerDeliveryReportPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/orders-view', 
        element: (
            <ProtectedRoute>
                <AllOrdersViewPage />
            </ProtectedRoute>
        ),
    },
];
