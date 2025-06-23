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
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
import { clearToast } from './utils/toastSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';

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
  const toastState = useSelector((state: RootState) => state.toast);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (toastState.message) {
      toast[toastState.type || 'success'](toastState.message);
      dispatch(clearToast());
    }
  }, [toastState, dispatch]);
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
