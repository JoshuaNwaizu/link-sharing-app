import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import cleanUrl from '../../utils/cleanUrl';
import { useEffect, useState } from 'react';
import { fetchLinks } from '../../utils/linkSlice';
import { API } from '../../App';
import { fetchProfileById } from '../../utils/profileSlice';

const PhoneLink = () => {
  const { firstName, lastName, email, imageUrl } = useSelector(
    (state: RootState) => state.profile,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [dataError, setDataError] = useState<boolean>(false);

  const { links } = useSelector((state: RootState) => state.link);
  const emptyRects = Array.from({ length: 5 }, (_, i) => ({
    id: `empty-${i}`,
    y: 278 + i * 64,
  }));
  useEffect(() => {
    const getProfileAndLinks = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        // Fetch profile data
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
          return;
        }

        // Dispatch actions to fetch profile and links
        await dispatch(fetchProfileById(data._id));
        await dispatch(fetchLinks());
      } catch (err) {
        console.error('Error fetching data:', err);
        setDataError(true);
      }
    };

    getProfileAndLinks();
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchLinks());
  }, [dispatch]);

  if (dataError) {
    return (
      <div className="max-xl:hidden t h-[52.125rem] rounded-[1rem] bg-white p-[1.5rem] w-[30rem] items-center flex justify-center">
        <p className="text-red-500">Error fetching data</p>
      </div>
    );
  }
  return (
    <div className="max-xl:hidden t h-[52.125rem] rounded-[1rem] bg-white p-[1.5rem] w-[30rem] items-center flex justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="308"
        height="632"
        fill="none"
        viewBox="0 0 308 632"
        className="ext-white"
      >
        {/* Phone frame paths */}
        {status === 'loading'
          ? // Show loading state
            emptyRects.map((rect) => (
              <rect
                key={rect.id}
                width="237"
                height="44"
                x="35"
                y={rect.y}
                fill="#EEE"
                rx="8"
              />
            ))
          : links.length > 0
            ? // Show actual links
              links.map((link, index) => (
                <g
                  key={link.id || index}
                  transform={`translate(35, ${278 + index * 64})`}
                >
                  <a
                    href={cleanUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <rect
                      width="237"
                      height="44"
                      fill="#1A1A1A"
                      rx="8"
                    />

                    <image
                      href={`/images/icon-${link.platform.toLowerCase()}.svg`}
                      x="16"
                      y="12"
                      width="18"
                      height="18"
                    />
                    <text
                      x="48"
                      y="28"
                      fill="#fff"
                      fontSize="14"
                      className="capitalize"
                    >
                      {link.platform}
                    </text>
                    <image
                      href="/images/icon-arrow-right.svg"
                      x="205"
                      y="12"
                      width="20"
                      height="20"
                    />
                  </a>
                </g>
              ))
            : // Show empty state
              emptyRects.map((rect) => (
                <rect
                  key={rect.id}
                  width="237"
                  height="44"
                  x="35"
                  y={rect.y}
                  fill="#EEE"
                  rx="8"
                />
              ))}
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
            <image
              href={imageUrl}
              x="105.5"
              y="64"
              width="96"
              height="96"
              clipPath="circle(48px at center)"
            />
          </>
        )}

        {/* Name - Empty or Actual */}
        {firstName && lastName ? (
          <text
            x="153.5"
            y="193"
            textAnchor="middle"
            fill="#000"
            fontSize="16"
            fontWeight="bold"
            fontFamily="Arial"
          >
            {`${firstName} ${lastName}`}
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

        {/* Links - Empty or Actual */}
        {links.length > 0
          ? links.map((link, index) => (
              <g
                key={link.id}
                transform={`translate(35, ${278 + index * 64})`}
              >
                <a
                  href={cleanUrl(link.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <rect
                    width="237"
                    height="44"
                    fill="#1A1A1A"
                    rx="8"
                  />
                  <image
                    href={`/images/icon-${link.platform.toLowerCase()}.svg`}
                    x="16"
                    y="12"
                    width="18"
                    height="18"
                  />
                  <text
                    x="48"
                    y="28"
                    fill="#fff"
                    fontSize="14"
                    className="capitalize"
                  >
                    {link.platform}
                  </text>
                  <image
                    href="/images/icon-arrow-right.svg"
                    x="205" /* Changed from default to right-aligned position */
                    y="12"
                    width="20" /* Reduced from 96 */
                    height="20"
                    clipPath="circle(48px at center)"
                  />
                </a>
              </g>
            ))
          : emptyRects.map((rect) => (
              <rect
                key={rect.id}
                width="237"
                height="44"
                x="35"
                y={rect.y}
                fill="#EEE"
                rx="8"
              />
            ))}
      </svg>
    </div>
  );
};

export default PhoneLink;
