import { Link } from 'react-router';
import Button from './Button';

const ProfileCardNav = () => {
  return (
    <nav className="md:bg-[#633CFF] md:rounded-b-[2rem] md:h-[22rem] md:w-[48rem] w-full xl:w-[84rem]">
      <div className="max-w-[79.75rem] xl:w-[79.75rem] md:w-[42.75rem] w-full mx-auto">
        <div className="flex md:items-center sm:w-[24rem] md:w-full md: md:bg-white my-2.5 py-4 px-6 rounded-lg justify-between">
          <Link to={'/'}>
            <Button
              name="Back to Editor"
              className="py-[0.69rem] px-[1.7rem] bg-transparent text-[#633CFF] border-[#633CFF] border"
            />
          </Link>
          <Button
            name="Share Link"
            className="py-[0.69rem] px-[1.7rem] text-white bg-[#633CFF]"
          />
        </div>
      </div>
    </nav>
  );
};

export default ProfileCardNav;
