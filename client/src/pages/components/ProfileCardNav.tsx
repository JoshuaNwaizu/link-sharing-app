import { Link } from 'react-router';
import Button from './Button';

const ProfileCardNav = () => {
  return (
    <div className="flex my-2.5 py-0.5 justify-between">
      <Link to={'/'}>
        <Button
          name="Back to Editor"
          className="py-[0.69rem] px-[1.7rem] bg-transparent text-[#633CFF] border-[#633CFF] border"
        />
      </Link>
      <Button
        name="Share Link"
        className="py-[0.69rem] px-[1.7rem] text-white"
      />
    </div>
  );
};

export default ProfileCardNav;
