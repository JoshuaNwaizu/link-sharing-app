import { Outlet } from 'react-router';
import Nav from './components/Nav';

const HomeLayout = () => {
  return (
    <div className="w-[19.4375rem] flex flex-col  mx-auto">
      <Nav />
      <main className="flex flex-col items-center">
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout;
