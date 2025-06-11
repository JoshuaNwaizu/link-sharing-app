import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchUser, selectUserEmail } from '../../utils/dataSlice';
import { RootState, useAppDispatch } from '../../store';

interface ProfileFormsProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    isEmailDisabled: boolean;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userEmail?: string;
}
const ProfileForms: React.FC<ProfileFormsProps> = ({
  formData,
  onInputChange,
  // userEmail,
}) => {
  const dispatch = useAppDispatch();
  const userData = useSelector((state: RootState) => state.data.data);
  const email = useSelector(selectUserEmail);

  const userId = userData?.userId;

  console.log('the userId is:', userId);
  console.log('the email is:', email);

  useEffect(() => {
    if (!email && userId) {
      dispatch(fetchUser(userId))
        .unwrap()
        .then((user) => {
          console.log('Fetched user:', user);
        })
        .catch((error) => {
          console.error('Failed to fetch user:', error);
        });
    }
  }, [email, userId, dispatch]);

  const displayEmail = email || userData?.email || '';
  return (
    <div className="flex flex-col gap-3 p-[1.2rem] bg-[#FAFAFA]">
      <div className="xl:flex xl:items-center  xl:justify-between">
        <label
          htmlFor="first-name"
          className=" text-[#333] text-[.75rem] leading-[1.125rem] font-semibold"
        >
          First Name *
        </label>
        <div className="flex gap-2  py-[.75rem] border rounded-[.5rem] transition-all duration-250 focus-within:border-[#633CFF] focus-within:shadow-[0_0_32px_0_rgba(99,60,255,0.25)] border-[#D9D9D9] items-center px-[1rem]">
          <input
            type="text"
            className="border-none outline-none xl:w-[27rem]"
            placeholder="e.g John"
            name="firstName"
            id="first-name"
            value={formData.firstName}
            onChange={onInputChange}
            required
          />
        </div>
      </div>
      <div className="xl:flex xl:items-center  xl:justify-between">
        <label
          htmlFor="last-name"
          className=" text-[#333] text-[.75rem] leading-[1.125rem] font-semibold"
        >
          Last Name *
        </label>
        <div className="flex gap-2  py-[.75rem] border rounded-[.5rem] border-[#D9D9D9] items-center transition-all duration-250 focus-within:border-[#633CFF] focus-within:shadow-[0_0_32px_0_rgba(99,60,255,0.25)] px-[1rem]">
          <input
            type="text"
            className="border-none outline-none xl:w-[27rem]"
            placeholder="e.g Appleased"
            name="lastName"
            id="last-name"
            value={formData.lastName}
            onChange={onInputChange}
            required
          />
        </div>
      </div>
      <div className="xl:flex xl:items-center  xl:justify-between">
        <label
          htmlFor="email"
          className=" text-[#333] text-[.75rem] leading-[1.125rem] font-semibold"
        >
          Email
        </label>
        <div
          className={`flex gap-2 ${
            formData.isEmailDisabled
              ? 'bg-[#F0F0F0] text-[#737373] cursor-not-allowed'
              : ''
          } py-[.75rem] border rounded-[.5rem] border-[#D9D9D9] transition-all duration-250 focus-within:border-[#633CFF] focus-within:shadow-[0_0_32px_0_rgba(99,60,255,0.25)] items-center px-[1rem]`}
        >
          <input
            type="email"
            className="border-none outline-none xl:w-[27rem]"
            placeholder="e.g email@example.com"
            name="email"
            id="email"
            value={displayEmail}
            onChange={onInputChange}
            disabled={formData.isEmailDisabled}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileForms;
