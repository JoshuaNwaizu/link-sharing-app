import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { addLink } from '../../utils/linkSlice';
import { motion } from 'framer-motion';

const Hero = () => {
  const dispatch = useDispatch<AppDispatch>();
  const handleAddLink = () => {
    dispatch(addLink());
  };
  return (
    <div className="flex flex-col gap-8 ">
      <span className="flex flex-col gap-3">
        <h2 className="text-[1.5rem] md:text-[2rem] font-bold leading-[2.25rem]">
          Customize your links
        </h2>
        <p className="text-[#737373]">
          Add/edit/remove links below and then share all your profiles with the
          world!
        </p>
      </span>
      <motion.button
        className="cursor-pointer border border-[#633CFF] text-[#633CFF] rounded-[0.5rem] font-semibold leading-[1.5rem]  py-[0.6875rem] px-[1.6875rem]"
        onClick={handleAddLink}
        whileTap={{ scale: 0.95, y: 2 }}
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        + Add new link
      </motion.button>
    </div>
  );
};

export default Hero;
