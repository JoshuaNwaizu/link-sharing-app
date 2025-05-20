import React from 'react';

const Loader = () => {
  return (
    <div className="fixed h-screen inset-0 bg-black/5 backdrop-blur-[4px] z-[999] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="loader"
          style={{ '--s': '30px' } as React.CSSProperties}
        />
      </div>
    </div>
  );
};

export default Loader;
