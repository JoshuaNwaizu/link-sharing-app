import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { platformColors } from './components/PhoneLink';
import ProfileInfoSkeleton from './components/ProfileInfoSkeleton';
import ErrorCard from './components/ErrorCard';
import cleanUrl from '../utils/cleanUrl';
import { API } from '../App';

import { RootState, useAppDispatch } from '../store';
import { useSelector } from 'react-redux';
import { fetchOflineLinks } from '../utils/linkSlice';

interface ProfileData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl?: string;
  image?: {
    url: string;
  };
}

const PublicProfile = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const links = useSelector((state: RootState) => state.link.links);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const linkStatus = useSelector((state: RootState) => state.link.status);
  const linkError = useSelector((state: RootState) => state.link.error);

  const getPlatformColor = (platform: string): string => {
    const normalized = platform.toLowerCase().replace(/[\s.-]/g, '');
    return (
      platformColors[normalized as keyof typeof platformColors] || '#1A1A1A'
    );
  };

  const isLightBackground = (color: string): boolean => {
    return color === '#FAFAFA' || color === '#FFFFFF';
  };

  useEffect(() => {
    const fetchPublicProfile: () => Promise<void> = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const profileRes = await fetch(`${API}/profile/${id}`);
        const profileData = await profileRes.json();
        console.log('Profile data:', profileData);
        console.log('Profile user ID:', profileData.user);

        setProfile(profileData);

        // Add error handling for the dispatch
        try {
          const result = await dispatch(
            fetchOflineLinks(profileData.user),
          ).unwrap();
          console.log('Fetched links result:', result);
        } catch (err) {
          console.error('Error fetching links:', err);
          setError(
            err instanceof Error ? err.message : 'Failed to fetch links',
          );
        }
      } catch (err) {
        console.error('Error:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch profile',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [id, dispatch]);
  if (loading || linkStatus === 'loading') return <ProfileInfoSkeleton />;
  if (error || linkError || !profile)
    return <ErrorCard message={error || linkError || 'User not found'} />;

  return (
    <div className="flex flex-col md:rounded-[1.5rem] mx-auto w-full mt-[4rem] md:shadow-[0_0_32px_0_rgba(0,0,0,0.10)] md:bg-[#fff] items-center xl:w-[21rem] md:py-[3rem] md:px-[3.5rem] justify-center">
      <div className="flex flex-col w-[14.8125rem] gap-9">
        <div className="flex items-center justify-center gap-3.5 flex-col">
          <div>
            {profile.image?.url && (
              <img
                src={profile.image.url}
                alt="profile image"
                className="rounded-full object-cover border-4 border-[#633CFF] w-[6rem] h-[6rem] flex items-center justify-center"
              />
            )}
          </div>

          <h1 className="flex capitalize gap-2 text-[2rem] font-bold leading-[3rem]">
            <span>{profile.firstName}</span>
            <span>{profile.lastName}</span>
          </h1>
          <p className="text-[#737373] leading-[1.5rem]">{profile.email}</p>
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
                  key={link.url}
                  href={cleanUrl(link.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    className={`flex items-center justify-between p-4 rounded-lg ${textColor}`}
                    style={{ backgroundColor: bgColor }}
                  >
                    <span className="flex gap-2">
                      <img
                        src={`/images/icon-${link.platform}.svg`}
                        alt={link.platform}
                        className={iconFilter}
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

export default PublicProfile;
