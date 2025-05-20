interface ProfilePictureProps {
  preview: string | ArrayBuffer | null;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}
const ProfilePicture: React.FC<ProfilePictureProps> = ({
  preview,
  onImageChange,
  fileInputRef,
}) => {
  const getPreviewUrl = (preview: string | ArrayBuffer | null): string => {
    if (!preview) return '';
    if (typeof preview === 'string') return preview;
    // Convert ArrayBuffer to base64 string
    const bytes = new Uint8Array(preview);
    const binary = bytes.reduce(
      (acc, byte) => acc + String.fromCharCode(byte),
      '',
    );
    return `data:image/*;base64,${btoa(binary)}`;
  };
  return (
    <div className="flex flex-col xl:h-[14.5625rem] p-4 xl:items-center xl:justify-center xl:gap-[4rem] xl:flex-row gap-3  xl:rounded-[0.75rem] bg-[#FAFAFA]">
      <h1>Profile picture</h1>
      <input
        type="file"
        id="file-upload"
        name="file-upload"
        onChange={onImageChange}
        accept="image/jpg,image/png"
        hidden
        ref={fileInputRef}
      />

      <label
        htmlFor="file-upload"
        className="cursor-pointer"
      >
        {preview ? (
          <div className="relative  w-[12rem] h-[12rem] group">
            <img
              src={getPreviewUrl(preview)}
              alt="Preview"
              className="w-[12rem] h-[12rem] md:w-[12.0625rem] md:h-[12.0625rem] object-cover rounded-[.75rem]"
            />
            <div className="absolute inset-0 bg-black/50  opacity-100  flex items-center flex-col justify-center  rounded-[.75rem]">
              <img
                src="/images/icon-upload-image.svg"
                alt="upload"
                className="w-[2.5rem] "
              />
              <span className="text-white font-semibold">Change Image</span>
            </div>
          </div>
        ) : (
          <div className="bg-[#EFEBFF] pt-[3.8125rem] pb-[3.75rem] w-[13rem] rounded-[0.75rem] pr-[2.375rem] pl-[2.4375rem] flex flex-col justify-center gap-2 items-center">
            <img
              src="/images/icon-upload-image.svg"
              alt=""
              className="w-[2.5rem]"
            />
            <span className="text-[#633CFF] font-semibold">
              + Upload a file
            </span>
          </div>
        )}
      </label>
      <span className="text-[#737373] text-[0.75rem] xl:w-[13rem] leading-[1.13rem]">
        Image must be below 1024x1024px. Use PNG or JPG format.
      </span>
    </div>
  );
};

export default ProfilePicture;
