import { Outlet } from 'react-router';
import Nav from './components/Nav';
import PhoneLink from '../../pages/components/PhoneLink';
const HomeLayout = () => {
  // useLenis();
  return (
    <div className="min-h-screen  flex justify-center  md:bg-[#FAFAFA]">
      <div className="w-[90%] md:w-[40.0625rem] xl:w-full xl:mx-auto">
        <Nav />
        {/* <ScrollTrigger> */}
        <main className="  md:p-6 xl:p-8 ">
          <div className="flex flex-col  xl:flex-row xl:mt-[5rem] md:items-center items-center xl:items-start gap-6 xl:gap-5 justify-center xl:justify-center ">
            <div className="">
              <PhoneLink />
            </div>
            <div className="flex-1 w-full xl:w-[47rem] flex items-center  max-w-[50.5rem]">
              <Outlet />
            </div>
          </div>
        </main>
        {/* </ScrollTrigger> */}
      </div>
    </div>
  );
};

export default HomeLayout;
