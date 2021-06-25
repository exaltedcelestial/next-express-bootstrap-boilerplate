import axios from 'axios';

export default function (baseURL) {
  const instance = axios.create({
    baseURL,
  });

  instance.interceptors.response.use((response) => response, (error) => {
    // Do something with response error
    // return Promise.reject(error);

    if (error.response) {
      const { data } = error.response;
      const validData = data && data.code;

      if (validData) {
        return Promise.reject(data);
      }
    }
    return Promise.reject(error);
  });

  return instance;
}
