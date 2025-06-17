import { useDispatch, useSelector } from 'react-redux';
import Button from './components/Button';
import Hero from './components/Hero';
import LinkCard from './components/LinkCard';
import { AppDispatch, RootState } from '../store';
import { fetchLinks, saveLinks } from '../utils/linkSlice';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import LoadingSkeleton from './components/LoadingSkeleton';
import Loader from './components/Loader';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { AnimatePresence } from 'framer-motion';
// ...other imports...
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { links, status } = useSelector((state: RootState) => state.link);
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    const reorderedLinks = Array.from(links);
    const [removed] = reorderedLinks.splice(result.source.index, 1);
    reorderedLinks.splice(result.destination.index, 0, removed);
    const linksWithOrder = reorderedLinks.map((link, idx) => ({
      ...link,
      index: idx,
    }));
    dispatch({ type: 'link/reorderLinks', payload: linksWithOrder });
  };
  const fetchUserLinks = useCallback(async () => {
    try {
      await dispatch(fetchLinks()).unwrap();
    } catch (error: any) {
      console.error('Failed to fetch links:', error);
      if (
        error?.status === 401 ||
        error?.response?.status === 401 ||
        error?.message?.toLowerCase().includes('unauthorized')
      ) {
        navigate('/auth/signup');
      } else {
        console.error('Failed to fetch links:', error);
      }
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    const controller = new AbortController();
    fetchUserLinks();
    return () => controller.abort();
  }, [fetchUserLinks]);

  const handleSave = async () => {
    try {
      await dispatch(saveLinks()).unwrap();
      // Refetching links after successful save
      await dispatch(fetchLinks()).unwrap();
      toast.success('Links saved successfully!');
    } catch (error) {
      console.error('Error saving links:', error);
      toast.error('Error saving link!');
    }
  };

  // Show loading state
  if (status === 'loading' && !links.length) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      {status === 'loading' && <Loader />}
      <div className="mt-[8rem] xl:mt-0 lg:h-[52.125rem] p-[1.5rem] flex flex-col gap-7 rounded-[1rem] bg-white md:w-[40.0625rem] xl:w-[50.5rem] w-full">
        <Hero />
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="links-droppable">
            {(provided) => (
              <div
                className="flex-1 custom-scrollbar overflow-y-auto py-[4rem] shadow-container flex flex-col gap-7 min-h-0 custom-scrollbar"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <AnimatePresence>
                  {links.length > 0 ? (
                    links.map((link, index) => (
                      <Draggable
                        key={link.id}
                        draggableId={link.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <LinkCard
                              id={link.id}
                              url={link.url}
                              platform={link.platform}
                              index={index}
                              dragHandleProps={
                                provided.dragHandleProps ?? undefined
                              }
                            />
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 py-8 ">
                      <img
                        src="/images/illustration-empty.svg"
                        alt=""
                        className="w-[7.79788rem] h-[5rem] md:w-[15.59581rem] md:h-[10rem]"
                      />
                      <h2 className="text-[#333] text-[1.5rem] font-bold leading-[2.2rem] ">
                        Let's get you started!
                      </h2>
                      <p className="text-[#737373] leading-[1.5rem] text-center">
                        Use the “Add new link” button to get started. Once you
                        have more than one link, you can reorder and edit them.
                        We’re here to help you share your profiles with
                        everyone!
                      </p>
                    </div>
                  )}
                </AnimatePresence>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="mt-auto pt-4 w-full">
          <hr className="border-gray-200" />
          <div className="flex md:justify-end">
            <Button
              name={status === 'loading' ? 'Saving...' : 'Save'}
              type="button"
              className={`mt-4 w-full md:w-auto text-white ${!links.length || (status === 'loading' && 'opacity-[0.25]')} md:py-[0.6875rem] md:px-[1.6875rem] md:justify-end`}
              onClick={handleSave}
              disabled={status === 'loading' || links.length === 0}
            />
          </div>
        </div>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={true}
        />
      </div>{' '}
    </>
  );
};
``;

export default Home;
