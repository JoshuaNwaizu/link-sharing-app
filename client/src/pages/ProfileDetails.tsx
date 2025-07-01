import { useRef, useState } from 'react';
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
// import { Profile } from '../utils/cleanUrl';
import { toast } from 'react-toastify';
import Loader from './components/Loader';
import { NavigateFunction, useNavigate } from 'react-router';
import { API } from '../App';
import { useLoginModal } from './contexts/LoginModalContext';
import LoginRequiredModal from './components/LoginRequiredModal';

const ProfileDetails = () => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useAppDispatch();
  const { isOpen, openModal, closeModal } = useLoginModal();

  const { firstName, lastName, email, imageUrl, loading, isEmailDisabled } =
    useSelector((state: RootState) => state.profile);
  const userData = useSelector((state: RootState) => state.data.data);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
  }>({});

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isFormValid = () => {
    return Boolean(firstName?.trim() || lastName?.trim() || email?.trim());
  };

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

  //   event.preventDefault();
  //   const newErrors: { firstName?: string; lastName?: string } = {};
  //   if (!firstName?.trim())
  //     newErrors.firstName = 'First name needs to be filled';
  //   toast.error('First name needs to be field');
  //   if (!lastName?.trim()) newErrors.lastName = 'Last name needs to be filled';

  //   setErrors(newErrors);

  //   // If there are errors, do not proceed
  //   if (Object.keys(newErrors).length > 0) return;

  //   const formDataToSend = new FormData();
  //   if (firstName) formDataToSend.append('firstName', firstName);
  //   if (lastName) formDataToSend.append('lastName', lastName);
  //   if (email) formDataToSend.append('email', email);
  //   if (fileInputRef.current?.files?.[0]) {
  //     formDataToSend.append('image', fileInputRef.current.files[0]);
  //   }
  //   await dispatch(saveOrUpdateProfile(formDataToSend)).unwrap();
  //   try {
  //     const authRes = await fetch(`${API}/checkAuth`, {
  //       credentials: 'include',
  //     });

  //     if (!authRes.ok) {
  //       navigate('/auth/signup');
  //       return;
  //     }
  //     // await dispatch(updateProfile(formDataToSend)).unwrap();
  //     await dispatch(saveOrUpdateProfile(formDataToSend)).unwrap();
  //     toast.success('Profile updated successfully!', {
  //       autoClose: 3000,
  //       hideProgressBar: true,
  //     });
  //     await dispatch(fetchProfile());
  //   } catch (error: any) {
  //     if (
  //       error?.status === 401 ||
  //       error?.response?.status === 401 ||
  //       (typeof error?.message === 'string' &&
  //         error.message.toLowerCase().includes('unauthorized'))
  //     ) {
  //       // Redirect to signup
  //       navigate('/auth/signup');
  //       return;
  //     }
  //     console.error('Error saving profile:', error);
  //     toast.error('Failed to update profile. Please try again.', {
  //       autoClose: 3000,
  //       hideProgressBar: true,
  //     });
  //   }
  // };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors: { firstName?: string; lastName?: string } = {};
    const authRes = await fetch(`${API}/checkAuth`, {
      credentials: 'include',
    });

    if (!authRes.ok) {
      openModal();

      return;
    }
    if (!firstName?.trim()) {
      newErrors.firstName = 'This field is required!';
    }

    if (!lastName?.trim()) {
      newErrors.lastName = 'This field is required!';
    }

    setErrors(newErrors);

    // If there are errors, do not proceed
    if (Object.keys(newErrors).length > 0) return;

    const formDataToSend = new FormData();
    if (firstName) formDataToSend.append('firstName', firstName);
    if (lastName) formDataToSend.append('lastName', lastName);
    if (email) formDataToSend.append('email', email);
    if (fileInputRef.current?.files?.[0]) {
      formDataToSend.append('image', fileInputRef.current.files[0]);
    }

    try {
      const authRes = await fetch(`${API}/checkAuth`, {
        credentials: 'include',
      });

      if (!authRes.ok) {
        navigate('/auth/signup');
        return;
      }

      await dispatch(saveOrUpdateProfile(formDataToSend)).unwrap();
      toast.success('Profile updated successfully!', {
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
        navigate('/auth/signup');
        return;
      }
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile. Please try again.', {
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <>
      {loading && <Loader />}
      <LoginRequiredModal
        open={isOpen}
        onClose={closeModal}
      />
      <section className="mt-[8rem] relative p-[1.5rem] flex flex-col gap-7 rounded-[1rem] bg-white md:w-[40.0625rem] lg:h-[52.125rem] xl:mt-0 xl:w-[50.5rem] w-full">
        <div className="flex flex-col gap-3">
          <h1 className="text-[1.5rem] font-bold leading-[2.25rem]">
            Profile Details
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
          error={errors}
        />

        <div className="mt-auto pt-4 w-full">
          <hr className="border-gray-200" />
          <div className="flex md:justify-end">
            <Button
              name={loading ? 'Saving...' : 'Save'}
              type="button"
              className={`mt-4 w-full hover:bg-transparent hover:text-[#633CFF] hover:border-[#633CFF] border transition-colors duration-200 md:w-auto text-white md:py-[0.6875rem] md:px-[1.6875rem] ${
                loading || !isFormValid ? 'opacity-50' : ''
              }`}
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfileDetails;
