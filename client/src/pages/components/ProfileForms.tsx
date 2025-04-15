const ProfileForms = () => {
  return (
    <div className="flex flex-col gap-3 p-[1.2rem] bg-[#FAFAFA]">
      <div>
        <label
          htmlFor="first-name"
          className=" text-[#333] text-[.75rem] leading-[1.125rem] font-semibold"
        >
          First Name *
        </label>
        <div className="flex gap-2  py-[.75rem] border rounded-[.5rem] border-[#D9D9D9] items-center px-[1rem]">
          <input
            type="text"
            className="border-none outline-none"
            name="firstName"
            id="first-name"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="last-name"
          className=" text-[#333] text-[.75rem] leading-[1.125rem] font-semibold"
        >
          Last Name *
        </label>
        <div className="flex gap-2  py-[.75rem] border rounded-[.5rem] border-[#D9D9D9] items-center px-[1rem]">
          <input
            type="text"
            className="border-none outline-none"
            name="lastName"
            id="last-name"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="email"
          className=" text-[#333] text-[.75rem] leading-[1.125rem] font-semibold"
        >
          Email
        </label>
        <div className="flex gap-2  py-[.75rem] border rounded-[.5rem] border-[#D9D9D9] items-center px-[1rem]">
          <input
            type="email"
            className="border-none outline-none"
            name="email"
            id="email"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileForms;
