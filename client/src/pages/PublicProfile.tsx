import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { platformColors } from './components/PhoneLink';
import ProfileInfoSkeleton from './components/ProfileInfoSkeleton';
import ErrorCard from './components/ErrorCard';
import cleanUrl from '../utils/cleanUrl';
import { API } from '../App';

import { RootState, useAppDispatch } from '../store';
import { useSelector } from 'react-redux';
import { fetchLinks } from '../utils/linkSlice';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const fetchPublicProfile = async () => {
      if (!id) {
        setError('Profile ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(`${API}/profile/${id}`);

        if (!res.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await res.json();
        console.log('Fetched profile data:', data);

        if (!data._id) {
          throw new Error('Profile not found');
        }

        setProfile(data);
        await dispatch(fetchLinks()).unwrap();
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [id, dispatch]);

  if (loading) return <ProfileInfoSkeleton />;
  if (error || !profile)
    return <ErrorCard message={error || 'User not found'} />;

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
                      />
                      <p className="capitalize">{link.platform}</p>
                    </span>
                    <img
                      src="/images/icon-arrow-right.svg"
                      alt="arrow"
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
