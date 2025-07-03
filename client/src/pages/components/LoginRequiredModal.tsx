import React from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open: boolean;
  onClose: () => void;
}

const LoginRequiredModal: React.FC<Props> = ({ open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg w-[90vw] max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <h2 className="text-xl font-bold mb-4 text-[#633CFF]">
              Login Required
            </h2>
            <p className="mb-6 text-[#333]">You need to log in to continue.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <Link to={'/auth/login'}>
                <button
                  className="px-4 py-2 rounded bg-[#633CFF] text-white hover:bg-[#4b2fd6]"
                  onClick={onClose}
                >
                  Log in
                </button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginRequiredModal;
