import { Link } from 'react-router';
import Button from './Button';
import { ToastContainer, toast } from 'react-toastify';

const ProfileCardNav = () => {
  const handleShareLink = async () => {
    try {
      // Get the user's unique profile URL
      const profileUrl = `${window.location.origin}/preview`;

      await navigator.clipboard.writeText(profileUrl);

      toast.success('Link copied to clipboard!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };
  return (
    <nav className="md:bg-[#633CFF] md:rounded-b-[2rem] md:h-[22rem] md:w-[48rem] w-full xl:w-[84rem]">
      <div className="max-w-[79.75rem] xl:w-[79.75rem] md:w-[42.75rem] w-full mx-auto">
        <div className="flex md:items-center sm:w-[24rem] md:w-full md: md:bg-white my-2.5 py-4 px-6 rounded-lg justify-between">
          <Link to={'/profile-details'}>
            <Button
              name="Back to Editor"
              className="py-[0.69rem] px-[1.7rem] bg-transparent text-[#633CFF] border-[#633CFF] border"
            />
          </Link>
          <Button
            name="Share Link"
            onClick={handleShareLink}
            className="py-[0.69rem] px-[1.7rem] text-white bg-[#633CFF]"
          />
        </div>
      </div>
      <ToastContainer />
    </nav>
  );
};

export default ProfileCardNav;
