import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import cleanUrl from '../../utils/cleanUrl';
import { useEffect, useState } from 'react';
import { fetchLinks } from '../../utils/linkSlice';
import { fetchProfile } from '../../utils/profileSlice';
import { motion } from 'framer-motion';
import { selectUserEmail } from '../../utils/dataSlice';
import PhoneLinkSkeleton from './PhoneLinkSkeleton';

export const platformColors = {
  github: '#1A1A1A',
  frontendmentor: '#FAFAFA',
  twitter: '#43B7E9',
  linkedin: '#2D68FF',
  youtube: '#EE3939',
  facebook: '#2442AC',
  twitch: '#EE3FC8',
  devto: '#333',
  codewars: '#8A1A50',
  freecodecamp: '#302267',
  gitlab: '#EB4925',
  hashnode: '#0330D1',
  stackoverflow: '#EC7100',
};

const PhoneLink = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    imageUrl: '',
  });
  const { firstName, lastName, imageUrl } = useSelector(
    (state: RootState) => state.profile,
  );
  const email = useSelector(selectUserEmail);
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { links } = useSelector((state: RootState) => state.link);
  const emptyRects = Array.from({ length: 5 }, (_, i) => ({
    id: `empty-${i}`,
    y: 278 + i * 64,
  }));
  const getPlatformColor = (platform: string): string => {
    const normalizedPlatform = platform.toLowerCase().replace(/[.\s-]/g, '');
    return (
      platformColors[normalizedPlatform as keyof typeof platformColors] ||
      '#1A1A1A'
    );
  };
  const isLightBackground = (color: string): boolean => {
    return color === '#FAFAFA' || color === '#FFFFFF';
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch both profile and links concurrently
        await Promise.all([
          dispatch(fetchProfile()).unwrap(),
          dispatch(fetchLinks()).unwrap(),
        ]);
      } catch (err) {
        console.error('Error loading initial data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [dispatch]);

  useEffect(() => {
    setUserData({
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      imageUrl: imageUrl || '',
    });
  }, [firstName, lastName, email, imageUrl]);

  if (isLoading) {
    return (
      <div className="max-xl:hidden bg-white h-[52.125rem] rounded-[1rem] p-[1.5rem] w-[30rem] items-center flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <PhoneLinkSkeleton />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-xl:hidden bg-white h-[52.125rem] rounded-[1rem]  p-[1.5rem] w-[30rem] items-center flex justify-center">
      <motion.svg
        initial={{
          x: -100,
          rotate: -10,
          opacity: 0,
        }}
        animate={{
          x: 0,
          rotate: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          type: 'spring',
          stiffness: 100,
          damping: 15,
        }}
        xmlns="http://www.w3.org/2000/svg"
        width="308"
        height="632"
        fill="none"
        viewBox="0 0 308 632"
        className="text-white "
      >
        {/* Phone frame paths */}

        <path
          stroke="#737373"
          d="M1 54.5C1 24.953 24.953 1 54.5 1h199C283.047 1 307 24.953 307 54.5v523c0 29.547-23.953 53.5-53.5 53.5h-199C24.953 631 1 607.047 1 577.5v-523Z"
        />
        <path
          fill="#fff"
          stroke="#737373"
          d="M12 55.5C12 30.923 31.923 11 56.5 11h24C86.851 11 92 16.149 92 22.5c0 8.008 6.492 14.5 14.5 14.5h95c8.008 0 14.5-6.492 14.5-14.5 0-6.351 5.149-11.5 11.5-11.5h24c24.577 0 44.5 19.923 44.5 44.5v521c0 24.577-19.923 44.5-44.5 44.5h-195C31.923 621 12 601.077 12 576.5v-521Z"
        />
        {/* Profile Image - Empty or Actual */}
        <circle
          cx="153.5"
          cy="112"
          r="48"
          fill="#EEE"
        />
        {imageUrl && (
          <>
            <defs>
              <clipPath id="profileClip">
                <circle
                  cx="153.5"
                  cy="112"
                  r="48"
                />
              </clipPath>
            </defs>{' '}
            <circle
              cx="153.5"
              cy="112"
              r="49"
              stroke="#633CFF"
              strokeWidth="4"
              fill="none"
            />
            <image
              href={imageUrl}
              x="105.5"
              y="64"
              width="96"
              height="96"
              clipPath="url(#profileClip)"
              preserveAspectRatio="xMidYMid slice"
            />
          </>
        )}
        {/* Name - Empty or Actual */}
        {userData.firstName || userData.lastName ? (
          <text
            x="153.5"
            y="193"
            textAnchor="middle"
            fill="#000"
            fontSize="16"
            fontWeight="bold"
            fontFamily="Arial"
          >
            {`${userData.firstName || ''} ${userData.lastName || ''}`.trim()}
          </text>
        ) : (
          <rect
            width="160"
            height="16"
            x="73.5"
            y="185"
            fill="#EEE"
            rx="8"
          />
        )}
        {/* Email - Empty or Actual */}
        {email ? (
          <text
            x="153.5"
            y="218"
            textAnchor="middle"
            fill="#737373"
            fontSize="14"
            fontFamily="Arial"
          >
            {email}
          </text>
        ) : (
          <rect
            width="72"
            height="8"
            x="117.5"
            y="214"
            fill="#EEE"
            rx="4"
          />
        )}

        <foreignObject
          x="35"
          y="278"
          width="237"
          height="300"
        >
          <div
            className="h-full overflow-y-auto custom-scrollbar"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#633CFF #FAFAFA',
            }}
          >
            <div className="space-y-4 pr-2">
              {links.length > 0
                ? links.map((link, index) => {
                    const bgColor = getPlatformColor(link.platform);
                    const textColor = isLightBackground(bgColor)
                      ? 'text-black'
                      : 'text-white';
                    const iconFilter = isLightBackground(bgColor)
                      ? ''
                      : 'brightness-0 invert';

                    return (
                      <motion.a
                        key={link.id}
                        href={cleanUrl(link.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                        initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 100,
                          damping: 15,
                          delay: index * 0.1,
                        }}
                      >
                        <div
                          className="relative h-11 rounded-lg flex items-center px-4"
                          style={{ backgroundColor: bgColor }}
                        >
                          <img
                            src={`/images/icon-${link.platform.toLowerCase()}.svg`}
                            alt={link.platform}
                            className={`w-4 h-4 ${iconFilter}`}
                          />
                          <span className={`ml-3 capitalize ${textColor} `}>
                            {link.platform}
                          </span>
                          <img
                            src="/images/icon-arrow-right.svg"
                            alt="arrow right"
                            className={`w-5 h-5 absolute right-4  transform transition-transform duration-300 ease-in-out group-hover:translate-x-2 ${iconFilter} `}
                          />
                        </div>
                      </motion.a>
                    );
                  })
                : emptyRects.map((rect) => (
                    <motion.div
                      key={rect.id}
                      className="h-11 bg-[#EEE] rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    />
                  ))}
            </div>
          </div>
        </foreignObject>
      </motion.svg>
    </div>
  );
};
export default PhoneLink;
