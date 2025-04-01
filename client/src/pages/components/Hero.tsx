import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { addLink } from '../../utils/linkSlice';

const Hero = () => {
  const dispatch = useDispatch<AppDispatch>();
  const handleAddLink = () => {
    dispatch(addLink());
  };
  return (
    <div className="flex flex-col gap-8 ">
      <span className="flex flex-col gap-3">
        <h2 className="text-[1.5rem] font-bold leading-[2.25rem]">
          Customize your links
        </h2>
        <p className="text-[#737373]">
          Add/edit/remove links below and then share all your profiles with the
          world!
        </p>
      </span>
      <button
        className=" border border-[#633CFF] text-[#633CFF] rounded-[0.5rem] font-semibold leading-[1.5rem]  py-[0.6875rem] px-[1.6875rem]"
        onClick={handleAddLink}
      >
        + Add new link
      </button>
    </div>
  );
};

export default Hero;
