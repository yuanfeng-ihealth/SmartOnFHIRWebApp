import React, { createContext, useContext } from 'react';

export const FHIRClientContext = createContext(null);

export const FHIRClientProvider = ({ fhir, children }) => (
  <FHIRClientContext.Provider value={fhir}>{children}</FHIRClientContext.Provider>
);

export const useFHIRClient = () => useContext(FHIRClientContext);
