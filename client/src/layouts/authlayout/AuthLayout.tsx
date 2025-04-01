import { Outlet } from 'react-router';
import Header from './components/Header';

const AuthLayout = () => {
  return (
    <div className="w-[19.4375rem] flex flex-col  mx-auto">
      <Header />
      <main className="mt-[6rem] mb-[2rem] flex flex-col ">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
