interface ProfileFormsProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const ProfileForms: React.FC<ProfileFormsProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="flex flex-col gap-3 p-[1.2rem] bg-[#FAFAFA]">
      <div className="xl:flex xl:items-center  xl:justify-between">
        <label
          htmlFor="first-name"
          className=" text-[#333] text-[.75rem] leading-[1.125rem] font-semibold"
        >
          First Name *
        </label>
        <div className="flex gap-2  py-[.75rem] border rounded-[.5rem] border-[#D9D9D9] items-center px-[1rem]">
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
        <div className="flex gap-2  py-[.75rem] border rounded-[.5rem] border-[#D9D9D9] items-center px-[1rem]">
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
        <div className="flex gap-2  py-[.75rem] border rounded-[.5rem] border-[#D9D9D9] items-center px-[1rem]">
          <input
            type="email"
            className="border-none outline-none xl:w-[27rem]"
            placeholder="e.g email@example.com"
            name="email"
            id="email"
            value={formData.email}
            onChange={onInputChange}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileForms;
