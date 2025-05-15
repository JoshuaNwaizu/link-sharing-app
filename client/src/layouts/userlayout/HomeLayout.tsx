import { Outlet } from 'react-router';
import Nav from './components/Nav';
import PhoneLink from '../../pages/components/PhoneLink';

const HomeLayout = () => {
  return (
    // <div className="w-[19.4375rem]  flex flex-col md:w-[40.0625rem]  mx-auto">
    //   <Nav />
    //   <main className="flex flex-col md:transform md:scale-80 md:origin-center items-center ">
    //     <Outlet />
    //   </main>
    // </div>
    <div className="min-h-screen  bg-[#FAFAFA]">
      <div className="w-[19.4375rem] md:w-[40.0625rem] xl:w-full mx-auto">
        <Nav />
        <main className="p-4  md:p-6 xl:p-8">
          <div className="flex flex-col  xl:flex-row xl:mt-[5rem] items-center xl:items-start gap-6 xl:gap-5 xl:justify-center ">
            <div className="">
              <PhoneLink />
            </div>
            <div className="flex-1 w-full xl:w-[47rem]  max-w-[50.5rem]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
