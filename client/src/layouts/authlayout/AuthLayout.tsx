import { Outlet } from 'react-router';
import Header from './components/Header';
import TabletHeader from './components/TabletHeader';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:items-center md:justify-center bg-[#FAFAFA]">
      <div className="w-[19.4375rem] flex min-h-screen flex-col  mx-auto md:w-full md:max-w-7xl md:scale-90 md:transform md:origin-center  md:justify-center md:items-center">
        <Header />
        <TabletHeader />
        <main className="mt-[7rem] md:mt-[4rem] mb-[2rem] flex flex-col md:h-[33%]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
