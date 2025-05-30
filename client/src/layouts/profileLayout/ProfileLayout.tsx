import { Outlet } from 'react-router';
import ProfileCardNav from '../../pages/components/ProfileCardNav';

const ProfileLayout = () => {
  return (
    <div className="w-[90%] flex  flex-col items-center md:justify-center  md:w-full mx-auto xl:w-full">
      <ProfileCardNav />
      <main className="mt-[4rem] mb-[2rem] flex md:-translate-y-[13rem] w-full flex-col xl:z-30">
        <Outlet />
      </main>
    </div>
  );
};

export default ProfileLayout;
