import { createBrowserRouter, RouterProvider } from 'react-router';
import AuthLayout from './layouts/authlayout/AuthLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import HomeLayout from './layouts/userlayout/HomeLayout';
import ProfileDetails from './pages/ProfileDetails';

export const API = import.meta.env.VITE_BASE_URL as string;

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    path: '/auth',
    children: [
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
    ],
  },
  {
    element: <HomeLayout />,
    path: '/',
    children: [
      { path: '', element: <Home /> },
      { path: 'profile-details', element: <ProfileDetails /> },
    ],
  },
]);
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
