import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  removeLink,
  toggleOptionTitle,
  updateLink,
  updateLinkPlatform,
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
  'devto',
  'codewars',
];

const platformPrefixes: { [key: string]: string } = {
  github: 'https://www.github.com/',
  facebook: 'https://www.facebook.com/',
  twitter: 'https://twitter.com/',
  linkedin: 'https://www.linkedin.com/in/',
  youtube: 'https://www.youtube.com/',
  freecodecamp: 'https://www.freecodecamp.org/',
  'frontend-mentor': 'https://www.frontendmentor.io/',
  gitlab: 'https://gitlab.com/',
  hashnode: 'https://hashnode.com/@',
  'stack-overflow': 'https://stackoverflow.com/users/',
  twitch: 'https://www.twitch.tv/',
  devto: 'https://dev.to/',
  codewars: 'https://www.codewars.com/users/',
};

const isValidUrl = (url: string, platform: string): boolean => {
  const prefix = platformPrefixes[platform];
  if (!url.startsWith(prefix)) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const LinkCard = ({
  id,
  url = '',
  platform = 'github',
  dragHandleProps,
}: {
  id: string;
  url?: string;
  platform?: string;
  dragHandleProps?: React.HTMLAttributes<HTMLImageElement>;
}) => {
  const [platformTitle, setPlatformTitle] = useState<string>(platform);
  const [isDropDown, setIsDropDown] = useState<boolean>(false);
  const [userInput, setUserInput] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string>('');
  const { toggleOption } = useSelector((state: RootState) => state.link);
  const isOpen = toggleOption === id;

  useEffect(() => {
    const prefix = platformPrefixes[platformTitle] || '';
    const userPart = url.replace(prefix, '');
    setUserInput(userPart || '');
  }, [platformTitle, url]);

  const handlePlatformSelect = (item: string) => {
    if (item === platformTitle) {
      setIsDropDown(false);
      dispatch(toggleOptionTitle('')); // Close the dropdown in Redux too
      return;
    }
    setPlatformTitle(item);
    setIsDropDown(false);
    setError('');

    const prefix = platformPrefixes[item] || '';
    setUserInput('');
    // Remove this: dispatch(setPlatform(item));
    dispatch(updateLinkPlatform({ id, platform: item })); // Use id, not index!
    dispatch(toggleOptionTitle(id));
    dispatch(
      updateLink({
        id,
        url: prefix,
        platform: item,
      }),
    );
  };
  const handleToggleOption = () => {
    if (toggleOption === id) {
      // Already open, so close it
      dispatch(toggleOptionTitle(''));
      setIsDropDown(false);
    } else {
      dispatch(toggleOptionTitle(id));
      setIsDropDown(true);
    }
  };
  const handleRemoveLink = () => {
    dispatch(removeLink(id));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUserInput = e.target.value;
    setUserInput(newUserInput);
    setError('');

    const prefix = platformPrefixes[platformTitle] || '';
    const fullUrl = `${prefix}${newUserInput}`;

    if (!newUserInput) {
      setError("Can't be empty");
    } else if (!isValidUrl(fullUrl, platformTitle)) {
      setError('Please check the URL');
    }

    dispatch(
      updateLink({
        id,
        url: fullUrl,
        platform: platformTitle,
      }),
    );
  };

  useEffect(() => {
    setPlatformTitle(platform);
  }, [platform]);

  return (
    <div className="bg-[#FAFAFA] p-[1.25rem] rounded-[0.75rem]">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-3">
          <img
            src="/images/icon-drag-and-drop.svg"
            alt="drag and drop"
            className="w-[.75rem] "
            {...(dragHandleProps || {})}
          />
          <h1 className="text-[1rem] font-bold tex-[#737373]">Link #{id}</h1>
        </span>
        <p
          className="text-[#737373] cursor-pointer"
          onClick={handleRemoveLink}
        >
          Remove
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {/* PLATFORM DROPDOWN */}
        <div className="flex flex-col gap-3">
          <p>Platform</p>
          <div
            className="flex items-center relative border border-[#D9D9D9] bg-white py-[0.75rem] rounded-[.5rem] px-[1rem] justify-between cursor-pointer"
            onClick={handleToggleOption}
          >
            <p className="flex items-center gap-3 ">
              <img
                src={`/images/icon-${platformTitle}.svg`}
                alt={platformTitle}
              />
              <span className="capitalize">{platformTitle}</span>
            </p>
            <div
              className={`flex flex-col h-[17rem] absolute overflow-scroll ${isOpen ? 'flex' : 'hidden'} top-13 gap-2 z-10 left-0 w-[17rem] bg-white shadow-2xl rounded-[.5rem] p-5`}
            >
              {platformNames.map((name, index) => (
                <p
                  key={index}
                  onClick={() => handlePlatformSelect(name)}
                  className={`flex items-center cursor-pointer gap-3 ${
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
              className={`cursor-pointer ${isDropDown && 'rotate-[180deg]'}`}
            >
              <path
                d="M1 1L7 7L13 1"
                stroke="#633CFF"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* URL INPUT */}
        <div className="flex flex-col gap-3">
          <p>Link</p>
          <span className="flex items-center transition-all duration-250 gap-2 bg-[#fff] border focus-within:border-[#633CFF] focus-within:shadow-[0_0_32px_0_rgba(99,60,255,0.25)] border-[#D9D9D9] p-[1rem] rounded-[0.5rem]">
            <img
              src="/images/icon-link.svg"
              alt="link"
              className="w-[1rem]"
            />
            <span className="flex items-center">
              <span className="text-[#737373]  select-none">
                {platformPrefixes[platformTitle]}
              </span>
              <input
                type="text"
                value={userInput}
                placeholder="e.g. johnappleseed"
                className="outline-none border-none  text-[#737373] bg-white w-full"
                onChange={handleUrlChange}
              />
            </span>
          </span>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default LinkCard;
