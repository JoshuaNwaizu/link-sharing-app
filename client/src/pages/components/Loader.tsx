import React from 'react';
import { createPortal } from 'react-dom';

const Loader = () => {
  return createPortal(
    <div className="fixed inset-0 h-screen bg-black/5 backdrop-blur-[4px] z-[999] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="loader"
          style={{ '--s': '30px' } as React.CSSProperties}
        />
      </div>
    </div>,
    document.body, // Render directly in body to avoid parent transforms
  );
};

export default Loader;
