const ProfilePicture = () => {
  return (
    <div className="flex flex-col gap-3 p-[1.2rem] bg-[#FAFAFA]">
      <h1>Profile picture</h1>
      <input
        type="file"
        id="file-upload"
        name="file-upload"
        accept="image/*"
        hidden
      />
      <label
        htmlFor="file-upload"
        className="bg-[#EFEBFF] pt-[3.8125rem] w-[13rem] rounded-[0.75rem] pr-[2.375rem] pb-[3.75rem] pl-[2.4375rem] flex flex-col justify-center gap-2 items-center"
      >
        <img
          src="/images/icon-upload-image.svg"
          alt=""
          className="w-[2.5rem]"
        />
        <span className="text-[#633CFF] font-semibold">+ Upload a file</span>*
      </label>
      <span className="text-[#737373] text-[0.75rem] leading-[1.13rem]">
        Image must be below 1024x1024px. Use PNG or JPG format.
      </span>
    </div>
  );
};

export default ProfilePicture;
