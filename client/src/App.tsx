import { createBrowserRouter, RouterProvider } from 'react-router';
import AuthLayout from './layouts/authlayout/AuthLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomeLayout from './layouts/userlayout/HomeLayout';
import ProfileDetails from './pages/ProfileDetails';
import ProfileCard from './pages/ProfileCard';
import ProfileLayout from './layouts/profileLayout/ProfileLayout';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import PublicProfile from './pages/PublicProfile';
import { ToastContainer } from 'react-toastify';

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
  {
    element: <ProfileLayout />,
    path: '/profile',
    children: [{ path: 'profile-info', element: <ProfileCard /> }],
  },
  { element: <PublicProfile />, path: '/profile/:id' },
]);
const App = () => {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
