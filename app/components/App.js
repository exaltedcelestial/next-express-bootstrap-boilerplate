import React from 'react';
import axios from '../helpers/axios';

export const AppContext = React.createContext({});
const defaultURL = 'http://localhost:3004/';
console.log('url used:', process.env.BACKEND_URL || defaultURL)
const instance = axios(process.env.BACKEND_URL || defaultURL);
const App = ({ children }) => (
  <AppContext.Provider value={{ fetchAPI: instance }}>
    {children}
  </AppContext.Provider>
);

export default App;
