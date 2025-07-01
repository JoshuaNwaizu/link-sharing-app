import React, { createContext, useContext, useState } from 'react';

interface LoginModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(
  undefined,
);

export const LoginModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <LoginModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </LoginModalContext.Provider>
  );
};

export const useLoginModal = () => {
  const context = useContext(LoginModalContext);
  if (!context)
    throw new Error('useLoginModal must be used within a LoginModalProvider');
  return context;
};
