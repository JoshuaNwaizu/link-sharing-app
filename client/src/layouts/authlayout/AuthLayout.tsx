import { Outlet, useLocation } from 'react-router';
import Header from './components/Header';
import TabletHeader from './components/TabletHeader';
import { AnimatePresence, motion } from 'framer-motion';

const AuthLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/auth/login';
  return (
    <AnimatePresence mode="wait">
      <div className="min-h-screen flex  flex-col md:items-center md:justify-center bg-[#FAFAFA]">
        <div className="w-[19.4375rem] flex min-h-screen flex-col  items-center  mx-auto md:w-full md:max-w-7xl md:scale-90 md:transform md:origin-center  md:justify-center md:items-center">
          <Header />
          <TabletHeader />
          <motion.main
            className="mt-[7rem] md:mt-[4rem] max-md:w-[21rem] mb-[2rem]  flex flex-col md:h-[33%]"
            key={location.pathname}
            initial={{ x: isLoginPage ? -300 : 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isLoginPage ? 300 : -300, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default AuthLayout;
