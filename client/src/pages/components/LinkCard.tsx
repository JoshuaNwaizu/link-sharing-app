import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  removeLink,
  toggleOptionTitle,
  updateLink,
} from '../../utils/linkSlice';

export interface PlatformIcon {
  name: string;
  icon: string;
}

const platformNames: string[] = [
  'facebook',
  'freecodecamp',
  'frontend-mentor',
  'github',
  'gitlab',
  'hashnode',
  'linkedin',
  'stack-overflow',
  'twitter',
  'twitch',
  'youtube',
  'linkedin',
];
const LinkCard = ({
  id,
  url = '',
  platform = 'github',
}: {
  id: string;
  url?: string;
  platform?: string;
}) => {
  const [platformTitle, setPlatformTitle] = useState<string>(platform);
  const [isDropDown, setIsDropDown] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>(url);
  const dispatch = useDispatch<AppDispatch>();
  const { toggleOption } = useSelector((state: RootState) => state.link);
  const isOpen = toggleOption === id;

  const handlePlatformSelect = (item: string) => {
    setPlatformTitle(item);
    setIsDropDown(false);
    dispatch(toggleOptionTitle(id));
    dispatch(updateLink({ id, url: currentUrl, platform: platformTitle }));
  };
  const handleToggleOption = () => {
    dispatch(toggleOptionTitle(id));
    setIsDropDown(!isDropDown);
  };
  const handleRemoveLink = () => {
    dispatch(removeLink(id));
  };
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setCurrentUrl(newUrl);
    dispatch(
      updateLink({
        id,
        url: newUrl,
        platform: platformTitle,
      }),
    );
  };
  return (
    <div className="bg-[#FAFAFA] p-[1.25rem] rounded-[0.75rem]">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-3">
          <img
            src="/images/icon-drag-and-drop.svg"
            alt="drag and drop"
            className="w-[.75rem] "
          />
          <h1 className="text-[1rem] font-bold  tex-[#737373]">Link #{id}</h1>
        </span>
        <p
          className="text-[#737373] cursor-pointer"
          onClick={handleRemoveLink}
        >
          Remove
        </p>
      </div>
      <div className="flex flex-col gap-3 mt-4">
        <div className="flex flex-col gap-3">
          <p>Platform</p>
          <div className="flex items-center relative border border-[#D9D9D9] bg-white py-[0.75rem] rounded-[.5rem] px-[1rem] justify-between">
            <p className="flex items-center gap-3 ">
              <img
                src={`/images/icon-${platformTitle}.svg`}
                alt={platformTitle}
              />
              <span className="capitalize">{platformTitle}</span>
            </p>
            <div
              className={`flex flex-col absolute ${isOpen ? 'flex' : 'hidden'}  top-13 gap-2 z-10 left-0 bg-white shadow-2xl w-[17rem] rounded-[.5rem] p-5`}
            >
              {platformNames.map((name, i) => (
                <p
                  key={i}
                  onClick={() => handlePlatformSelect(name)}
                  className={`flex items-center gap-3 ${
                    platformTitle === name
                      ? 'text-[#333] font-bold'
                      : 'text-[#737373]'
                  }`}
                >
                  <img
                    src={`/images/icon-${name}.svg`}
                    alt={name}
                    className="w-[1rem]"
                  />
                  <span className="capitalize">{name}</span>
                </p>
              ))}
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="9"
              viewBox="0 0 14 9"
              fill="none"
              onClick={handleToggleOption}
              className={`cursor-pointer ${isOpen && 'rotate-[180deg]'}`}
            >
              <path
                d="M1 1L7 7L13 1"
                stroke="#633CFF"
                stroke-width="2"
              />
            </svg>
          </div>
        </div>
        <div className="flex flex-col  gap-3">
          <p>Link</p>
          <span className="flex items-center gap-3 bg-[#fff] border border-[#D9D9D9]  p-[1rem] rounded-[0.5rem]">
            <img
              src="/images/icon-link.svg"
              alt="link"
              className="w-[1rem]"
            />
            <input
              type="text"
              value={currentUrl}
              placeholder="e.g. https://www.github.com/johnappleseed"
              className="bg-white outline-none border-none"
              onChange={handleUrlChange}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;
