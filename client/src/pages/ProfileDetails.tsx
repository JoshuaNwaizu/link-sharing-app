import { useEffect, useRef, useState } from 'react';
import Button from './components/Button';
import ProfileForms from './components/ProfileForms';
import ProfilePicture from './components/ProfilePicture';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import {
  fetchProfile,
  saveOrUpdateProfile,
  setProfileData,
} from '../utils/profileSlice';
import { Profile } from '../utils/cleanUrl';
import { ToastContainer, toast } from 'react-toastify';
import Loader from './components/Loader';
import { useNavigate } from 'react-router';

const ProfileDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // const { firstName, lastName, email, imageUrl, loading, isEmailDisabled } =
  //   useSelector((state: RootState) => state.profile);
  const { firstName, lastName, email, imageUrl, loading, isEmailDisabled } =
    useSelector((state: RootState) => state.profile);
  const userData = useSelector((state: RootState) => state.data.data);

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isFormValid = () => {
    return Boolean(firstName?.trim() || lastName?.trim() || email?.trim());
  };
  // Fetch profile on component mount
  useEffect(() => {
    dispatch(fetchProfile())
      .unwrap()
      .then((profile: Profile | null) => {
        if (profile) {
          dispatch(
            setProfileData({
              firstName: profile.firstName,
              lastName: profile.lastName,
              email: profile.email,
              imageUrl: profile.image?.url || null,
              isEmailDisabled,
            }),
          );
          setPreview(profile.image?.url || null);
        }
      })
      .catch((error) => console.error('Failed to fetch profile:', error));
  }, [dispatch]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(
      setProfileData({
        firstName: name === 'firstName' ? value : firstName,
        lastName: name === 'lastName' ? value : lastName,
        email: name === 'email' ? value : email,
        imageUrl: preview || imageUrl,
        isEmailDisabled,
      }),
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    if (firstName) formDataToSend.append('firstName', firstName);
    if (lastName) formDataToSend.append('lastName', lastName);
    if (email) formDataToSend.append('email', email);
    if (fileInputRef.current?.files?.[0]) {
      formDataToSend.append('image', fileInputRef.current.files[0]);
    }
    await dispatch(saveOrUpdateProfile(formDataToSend)).unwrap();
    try {
      // await dispatch(updateProfile(formDataToSend)).unwrap();
      await dispatch(saveOrUpdateProfile(formDataToSend)).unwrap();
      toast.success('Profile updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
      await dispatch(fetchProfile());
    } catch (error: any) {
      if (
        error?.status === 401 ||
        error?.response?.status === 401 ||
        (typeof error?.message === 'string' &&
          error.message.toLowerCase().includes('unauthorized'))
      ) {
        // Redirect to signup
        navigate('/auth/signup');
        return;
      }
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <>
      {loading && <Loader />}
      <section className="mt-[8rem] relative p-[1.5rem] flex flex-col gap-7 rounded-[1rem] bg-white md:w-[40.0625rem] lg:h-[52.125rem] xl:mt-0 xl:w-[50.5rem] w-full">
        <div className="flex flex-col gap-3">
          <h1 className="text-[1.5rem] font-bold leading-[2.25rem]">
            Profile Detailsss
          </h1>
          <p className="text-[#737373] leading-[1.5rem]">
            Add your details to create a personal touch to your profile.
          </p>
        </div>

        <ProfilePicture
          preview={preview || imageUrl}
          onImageChange={handleImageChange}
          fileInputRef={fileInputRef}
        />

        <ProfileForms
          formData={{ firstName, lastName, email, isEmailDisabled }}
          onInputChange={handleInputChange}
          userEmail={userData?.email}
        />

        <div className="mt-auto pt-4 w-full">
          <hr className="border-gray-200" />
          <div className="flex md:justify-end">
            <Button
              name={loading ? 'Saving...' : 'Save'}
              type="button"
              className={`mt-4 w-full md:w-auto text-white md:py-[0.6875rem] md:px-[1.6875rem] ${
                loading || !isFormValid ? 'opacity-50' : ''
              }`}
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
            />
          </div>
        </div>
        <ToastContainer
          position="top-right"
          theme="light"
        />
      </section>
    </>
  );
};

export default ProfileDetails;
