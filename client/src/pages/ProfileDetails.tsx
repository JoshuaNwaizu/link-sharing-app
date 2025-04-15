import Button from './components/Button';
import ProfileForms from './components/ProfileForms';
import ProfilePicture from './components/ProfilePicture';

const ProfileDetails = () => {
  return (
    <section className="mt-[8rem] relative p-[1.5rem] flex flex-col gap-7 rounded-[1rem] bg-white w-[21.4375rem]">
      <div className="flex flex-col gap-3">
        <h1 className="text-[1.5rem] font-bold leading-[2.25rem">
          Profile Details
        </h1>
        <p className="text-[#737373] leading-[1.5rem]">
          Add your details to create a personal touch to your profile.
        </p>
      </div>
      <ProfilePicture />
      <ProfileForms />
      <div className="mt-auto pt-4 w-full">
        <hr className="border-gray-200" />
        <Button
          name={'Save'}
          type="button"
          className="mt-4 w-full"
        />
      </div>
    </section>
  );
};

export default ProfileDetails;
