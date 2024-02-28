"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavbarContextProps {
  open: boolean;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
}

const NavbarContext = createContext<NavbarContextProps | undefined>(undefined);

export const useNavbarContext = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbarContext must be used within a NavbarProvider');
  }
  return context;
};

interface NavbarProviderProps {
  children: ReactNode;
}

export const NavbarProvider: React.FC<NavbarProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
    setClose(false);
  };

  const handleDrawerClose = () => {
    setClose(true);
    setOpen(false)

  };

  return (
    <NavbarContext.Provider value={{ open, handleDrawerOpen, handleDrawerClose }}>
      {children}
    </NavbarContext.Provider>
  );
};
