import { Link } from 'react-router';
import Button from './Button';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { useEffect } from 'react';
import { fetchProfile } from '../../utils/profileSlice';
import { API } from '../../App';

const ProfileCardNav = () => {
  const dispatch = useAppDispatch();
  const { id, firstName, lastName, imageUrl } = useSelector(
    (state: RootState) => state.profile,
  );

  useEffect(() => {
    dispatch(fetchProfile())
      .unwrap()
      .then((result) => {
        if (result?.id) {
          localStorage.setItem('profileId', result.id);
        }
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });
  }, [dispatch]);

  const handleShareLink = async () => {
    // Check if profile is complete
    if (!firstName || !lastName || !imageUrl) {
      toast.error('Please complete your profile before sharing');
      return;
    }

    let profileId = id;
    if (!profileId) {
      const storedId = localStorage.getItem('profileId');
      profileId = storedId || undefined;
    }

    if (!profileId) {
      toast.error('Profile not found. Please complete your profile first.');
      return;
    }

    try {
      // Check if user is authenticated
      const authResponse = await fetch(`${API}/checkAuth`, {
        credentials: 'include',
      });

      if (!authResponse.ok) {
        toast.error('Please log in to share your profile');
        return;
      }

      const profileUrl = `${window.location.origin}/profile/${profileId}`;
      await navigator.clipboard.writeText(profileUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing link:', error);
      toast.error('Failed to share link. Please try again.');
    }
  };
  return (
    <nav className="md:bg-[#633CFF] md:rounded-b-[2rem] md:h-[22rem] md:w-[48rem] w-full xl:w-[84rem]">
      <div className="max-w-[79.75rem] xl:w-[79.75rem] md:w-[42.75rem] w-full mx-auto">
        <div className="flex md:items-center sm:w-[24rem] md:w-full md: md:bg-white my-2.5 py-4 px-6 rounded-lg justify-between">
          <Link to={'/profile-details'}>
            <Button
              name="Back to Editor"
              className="py-[0.69rem] px-[1.7rem] bg-transparent text-[#633CFF] border border-[#633CFF] hover:bg-[#633CFF] hover:text-white transition-colors duration-200"
            />
          </Link>
          <Button
            name="Share Link"
            onClick={handleShareLink}
            className="py-[0.69rem] px-[1.7rem] text-white bg-[#633CFF] hover:bg-transparent hover:text-[#633CFF] hover:border-[#633CFF] border transition-colors duration-200"
          />
        </div>
      </div>
      {/* <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      /> */}
    </nav>
  );
};

export default ProfileCardNav;
