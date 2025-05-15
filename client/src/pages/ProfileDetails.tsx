import { useEffect, useRef, useState } from 'react';
import Button from './components/Button';
import ProfileForms from './components/ProfileForms';
import ProfilePicture from './components/ProfilePicture';

import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import {
  fetchProfile,
  saveProfile,
  setProfileData,
  updateProfile,
} from '../utils/profileSlice';

// const ProfileDetails = () => {
//   const dispatch = useAppDispatch();
//   const {
//     firstName,
//     lastName,
//     email,
//     imageUrl,
//     loading,
//     error,
//     success,
//     data,
//   } = useSelector((state: RootState) => state.profile);
//   const [formData, setFormData] = useState<{
//     firstName: string;
//     lastName: string;
//     email: string;
//     image: File | null;
//   }>({
//     firstName: '',
//     lastName: '',
//     email: '',
//     image: null,
//   });
//   const [preview, setPreview] = useState<string | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   // Set initial form data when profile is loaded
//   useEffect(() => {
//     if (data) {
//       setIsEditing(true);
//       setPreview(data.image?.url || null);
//     }
//   }, [data]);
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     dispatch(
//       setProfileData({
//         firstName: name === 'firstName' ? value : firstName,
//         lastName: name === 'lastName' ? value : lastName,
//         email: name === 'email' ? value : email,
//         imageUrl,
//       }),
//     );
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//       setFormData({ ...formData, image: file });
//     }
//   };
//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     const formDataToSend = new FormData();
//     formDataToSend.append('firstName', firstName);
//     formDataToSend.append('lastName', lastName);
//     formDataToSend.append('email', email);

//     if (fileInputRef.current?.files?.[0]) {
//       formDataToSend.append('image', fileInputRef.current.files[0]);
//     }
//     if (isEditing) {
//       await dispatch(updateProfile(formDataToSend));
//     } else {
//       await dispatch(saveProfile(formDataToSend));
//     }
//     dispatch(saveProfile(formDataToSend));
//   };
const ProfileDetails = () => {
  const dispatch = useAppDispatch();
  const { firstName, lastName, email, imageUrl, loading, error, success } =
    useSelector((state: RootState) => state.profile);
  const { links, status } = useSelector((state: RootState) => state.link);

  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch profile on component mount
  // useEffect(() => {
  //   dispatch(fetchProfile())
  //     .unwrap()
  //     .then((profile) => {
  //       if (profile) {
  //         setIsEditing(true);
  //         setPreview(profile.image?.url || null);
  //       }
  //     })
  //     .catch((error) => console.error('Failed to fetch profile:', error));
  // }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(
      setProfileData({
        firstName: name === 'firstName' ? value : firstName,
        lastName: name === 'lastName' ? value : lastName,
        email: name === 'email' ? value : email,
        imageUrl,
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
    formDataToSend.append('firstName', firstName);
    formDataToSend.append('lastName', lastName);
    formDataToSend.append('email', email);

    if (fileInputRef.current?.files?.[0]) {
      formDataToSend.append('image', fileInputRef.current.files[0]);
    }

    try {
      if (isEditing) {
        await dispatch(updateProfile(formDataToSend)).unwrap();
      } else {
        // await dispatch(saveProfile(formDataToSend)).unwrap();
        console.log('nopthig');
      }
      // Fetch updated profile data
      dispatch(fetchProfile());
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <section className="mt-[8rem] relative p-[1.5rem] flex flex-col gap-7 rounded-[1rem] bg-white md:w-[40.0625rem] lg:h-[52.125rem] xl:mt-0 xl:w-[50.5rem] w-[21.4375rem]">
      <div className="flex flex-col gap-3">
        <h1 className="text-[1.5rem] font-bold leading-[2.25rem">
          Profile Details
        </h1>
        <p className="text-[#737373] leading-[1.5rem]">
          Add your details to create a personal touch to your profile.
        </p>
      </div>

      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-500 text-sm p-2 bg-green-50 rounded">
          {success}
        </div>
      )}

      <ProfilePicture
        preview={preview}
        onImageChange={handleImageChange}
        fileInputRef={fileInputRef}
      />
      <ProfileForms
        formData={{ firstName, lastName, email }}
        onInputChange={handleInputChange}
      />
      <div className="mt-auto pt-4 w-full">
        <hr className="border-gray-200" />
        <Button
          name={loading ? 'Saving...' : 'Save'}
          type="button"
          className={`mt-4 w-full md:w-auto text-white ${!links.length && 'opacity-[0.25]'} md:py-[0.6875rem] md:px-[1.6875rem] md:justify-end`}
          onClick={handleSubmit}
          disabled={status === 'loading' || !links.length}
        />
      </div>
    </section>
  );
};

export default ProfileDetails;
