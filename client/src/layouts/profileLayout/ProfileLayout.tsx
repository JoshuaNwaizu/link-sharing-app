import { Outlet } from 'react-router';
import ProfileCardNav from '../../pages/components/ProfileCardNav';

const ProfileLayout = () => {
  return (
    <div className="w-[21.4375rem] flex flex-col  mx-auto">
      <ProfileCardNav />
      <main className="mt-[4rem] mb-[2rem] flex flex-col ">
        <Outlet />
      </main>
    </div>
  );
};

export default ProfileLayout;
