import React from 'react';
import getConfig from 'next/config';
import axios from '../helpers/axios';

export const AppContext = React.createContext({});

const { publicRuntimeConfig } = getConfig();
const defaultURL = 'http://localhost:3004/';
console.log('url used:', publicRuntimeConfig.url || defaultURL)
const instance = axios(publicRuntimeConfig.url || defaultURL);
const App = ({ children }) => (
  <AppContext.Provider value={{ fetchAPI: instance }}>
    {children}
  </AppContext.Provider>
);

export default App;
