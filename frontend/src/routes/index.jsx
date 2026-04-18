import Home from '../pages/Home';
import Orders from '../pages/Orders';
import Delivery from '../pages/Delivery';
import DeliveryReportPage from '../pages/DeliveryReportPage';

export const routes = [
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/orders',
        element: <Orders />,
    },
    {
        path: '/delivery',
        element: <Delivery />,
    },
    {
        path: '/reports', 
        element: <DeliveryReportPage />,
    }
];
