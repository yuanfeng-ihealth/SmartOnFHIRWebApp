import React, { createContext, useContext } from 'react';

export const StoreContext = createContext(null);

export const StoreProvider = ({ store, dispatch, children }) => {
  return <StoreContext.Provider value={{store: store, dispatch}}>{children}</StoreContext.Provider>
};

export const useStore = () => useContext(StoreContext);