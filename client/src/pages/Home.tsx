import { useDispatch, useSelector } from 'react-redux';
import Button from './components/Button';
import Hero from './components/Hero';
import LinkCard from './components/LinkCard';
import { AppDispatch, RootState } from '../store';
import { saveLinks } from '../utils/linkSlice';
// import { useEffect } from 'react';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { links, status } = useSelector((state: RootState) => state.link);

  const handleSave = () => {
    dispatch(saveLinks())
      .unwrap()
      .then((response) => {
        console.log('Links saved successfully!', response);
      })
      .catch((error) => {
        console.log(`Error saving links: ${error.message}`);
      });
  };
  return (
    <div className="mt-[8rem] relative px-4 py-6 flex flex-col gap-7  rounded-[1rem] bg-white w-[21.4375rem]">
      <Hero />

      {links.map((link) => {
        return (
          <LinkCard
            key={link.id}
            id={link.id}
            url={link.url}
            platform={link.platform}
          />
        );
      })}

      <div className="mt-auto pt-4 w-full">
        <hr className="border-gray-200" />
        <Button
          name={status === 'loading' ? 'Saving...' : 'Save'}
          type="button"
          className="mt-4 w-full"
          onClick={handleSave}
        />
      </div>
    </div>
  );
};
``;

export default Home;
