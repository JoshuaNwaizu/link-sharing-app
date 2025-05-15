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
    <div className="flex flex-col xl:items-center xl:justify-center xl:gap-[4rem] xl:flex-row gap-3 p-[1.2rem] xl:rounded-[0.75rem] bg-[#FAFAFA]">
      <h1>Profile picture</h1>
      <input
        type="file"
        id="file-upload"
        name="file-upload"
        onChange={onImageChange}
        accept="image/*"
        hidden
        ref={fileInputRef}
      />

      <label
        htmlFor="file-upload"
        className={`bg-[#EFEBFF] ${
          preview ? 'pt-[1rem] pb-[1rem]' : 'pt-[3.8125rem] pb-[3.75rem]'
        } w-[13rem] rounded-[0.75rem] pr-[2.375rem] pl-[2.4375rem] flex flex-col justify-center gap-2 items-center cursor-pointer`}
      >
        {preview ? (
          <img
            src={getPreviewUrl(preview)}
            alt="Preview"
            className="w-[6rem] h-[6rem] object-cover rounded-full"
          />
        ) : (
          <>
            <img
              src="/images/icon-upload-image.svg"
              alt=""
              className="w-[2.5rem]"
            />
            <span className="text-[#633CFF] font-semibold">
              + Upload a file
            </span>
          </>
        )}
      </label>
      <span className="text-[#737373] text-[0.75rem] xl:w-[13rem] leading-[1.13rem]">
        Image must be below 1024x1024px. Use PNG or JPG format.
      </span>
    </div>
  );
};

export default ProfilePicture;
