import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { fetchProfileById } from '../../utils/profileSlice';
import { fetchLinks } from '../../utils/linkSlice';
import { useEffect, useState } from 'react';
import { API } from '../../App';
import { platformColors } from './PhoneLink';
import cleanUrl from '../../utils/cleanUrl';
import ProfileInfoSkeleton from './ProfileInfoSkeleton';
import ErrorCard from './ErrorCard';
import { selectUserEmail } from '../../utils/dataSlice';

const ProfileInfo = () => {
  const dispatch = useAppDispatch();
  const {
    links,
    status,
    error: linkError,
  } = useSelector((state: RootState) => state.link);
  const { firstName, lastName, imageUrl, error } = useSelector(
    (state: RootState) => state.profile,
  );
  const email = useSelector(selectUserEmail);

  const data = useSelector((state: RootState) => state.data.data);
  const [dataError, setDataError] = useState<boolean>(false);
  const handleRetry = () => {
    if (data?.userId) {
      // Add null check for userId
      dispatch(fetchProfileById(data.userId));
      dispatch(fetchLinks());
    } else {
      console.error('No user ID available for retry');
      setDataError(true);
    }
  };
  const getPlatformColor = (platform: string): string => {
    // Normalize: remove dashes, dots, spaces, and lowercase
    const normalized = platform.toLowerCase().replace(/[\s.-]/g, '');
    return (
      platformColors[normalized as keyof typeof platformColors] || '#1A1A1A'
    );
  };
  const isLightBackground = (color: string): boolean => {
    return color === '#FAFAFA' || color === '#FFFFFF';
  };

  useEffect(() => {
    const getProfile = async () => {
      const token = localStorage.getItem('token'); // or from cookies if you're using cookies

      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const res = await fetch(`${API}/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            `Failed to fetch profile: ${res.status} ${errorText}`,
          );
        }

        const data = await res.json();

        if (!data) {
          setDataError(true);
        }
        console.log(data.id);

        dispatch(fetchProfileById(data._id));
      } catch (err) {
        console.error('Error fetching /me:', err);
      }
    };

    getProfile();
  }, []);

  useEffect(() => {
    dispatch(fetchLinks());
  }, [dispatch]);

  if (dataError) {
    <ErrorCard
      message="No profile information found. Please complete your profile."
      retry={handleRetry}
    />;
  }

  if (error) {
    <ErrorCard
      message={error}
      retry={handleRetry}
    />;
  }

  if (status === 'loading')
    return (
      <div>
        <ProfileInfoSkeleton />
      </div>
    );
  if (linkError) return <div>Error: {error}</div>;

  return (
    <div className="flex  flex-col md:rounded-[1.5rem] mx-auto w-full md:shadow-[0_0_32px_0_rgba(0,0,0,0.10)] md:bg-[#fff] items-center xl:w-[21rem] md:py-[3rem] md:px-[3.5rem]  justify-center ">
      <div className=" flex flex-col w-[14.8125rem] gap-9">
        <div className="flex items-center justify-center gap-3.5 flex-col">
          <div>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="profile image"
                className="rounded-full object-cover border-4 border-[#633CFF] w-[6rem] h-[6rem] flex items-center justify-center"
              />
            )}
          </div>

          <h1 className="flex capitalize gap-2 text-[2rem] font-bold leading-[3rem]">
            <span>{firstName}</span>
            <span>{lastName}</span>
          </h1>
          <p className="text-[#737373] leading-[1.5rem]">{email}</p>
        </div>
        <div>
          <div className="flex flex-col gap-2">
            {links.map((link) => {
              const bgColor = getPlatformColor(link.platform);
              const textColor = isLightBackground(bgColor)
                ? 'text-black'
                : 'text-white';
              const iconFilter = isLightBackground(bgColor)
                ? ''
                : 'brightness-0 invert';

              return (
                <a
                  href={cleanUrl(link.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {' '}
                  <div
                    key={link.url}
                    className={`flex items-center justify-between p-4 rounded-lg ${textColor}`}
                    style={{
                      backgroundColor: bgColor,
                    }}
                  >
                    <span className="flex gap-2">
                      <img
                        src={`/images/icon-${link.platform}.svg`}
                        className={iconFilter}
                        alt={link.platform}
                      />
                      <p className="capitalize">{link.platform}</p>
                    </span>

                    <img
                      src="/images/icon-arrow-right.svg"
                      alt="arrow"
                      className={iconFilter}
                    />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
