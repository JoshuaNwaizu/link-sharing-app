import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { fetchProfileById } from '../../utils/profileSlice';
import { fetchLinks } from '../../utils/linkSlice';
import { useEffect, useState } from 'react';
import { API } from '../../App';
import { platformColors } from './PhoneLink';

const ProfileInfo = () => {
  const dispatch = useAppDispatch();
  const {
    links,
    status,
    error: linkError,
  } = useSelector((state: RootState) => state.link);
  const { firstName, lastName, email, imageUrl, loading, error } = useSelector(
    (state: RootState) => state.profile,
  );
  const [dataError, setDataError] = useState<boolean>(false);

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

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (dataError) {
    <div className="text-red-500 font-bold text-4xl">There's no item here</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (status === 'loading') return <div>Loading...</div>;
  if (linkError) return <div>Error: {error}</div>;

  return (
    <div className="flex  flex-col md:rounded-[1.5rem] w-[21.8125rem] md:shadow-[0_0_32px_0_rgba(0,0,0,0.10)] md:bg-[#fff] items-center xl:w-[21rem] md:py-[3rem] md:px-[3.5rem]  justify-center ">
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
            {links.map((link) => (
              <div
                key={link.url}
                className="flex items-center justify-between bg-[#1A1A1A] text-white p-4 rounded-lg"
                style={{
                  backgroundColor:
                    platformColors[
                      link.platform.toLowerCase() as keyof typeof platformColors
                    ] || '#1A1A1A',
                }}
              >
                <span className="flex gap-2">
                  <img
                    src={`/images/icon-${link.platform}.svg`}
                    alt=""
                  />
                  <p>{link.platform}</p>
                </span>

                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/icon-arrow-right.svg"
                    alt="arrow"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
