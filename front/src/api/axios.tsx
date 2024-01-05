import axios, { AxiosRequestHeaders } from "axios";
import { showModal } from "@/components/Shared/TokenExpiredModal/ShowModal";
import { getSession } from "next-auth/react";

axios.interceptors.request.use(
  async function (config) {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: "Bearer " + session?.accessToken,
      } as AxiosRequestHeaders;
    }

    return config;
  },
  function (error) {
    if (error.request.status === 401) {
      return Promise.reject(error);
    }
  }
);

axios.interceptors.response.use(
  function (response) {
    if (response.data.sessionExpired === true) {
      localStorage.clear();
      delete axios.defaults.headers.common["Authorization"];
      showModal();
      return Promise.reject(response);
    } else {
      return response;
    }
  },

  function (error) {
    if (error.response.status === 401) {
      const token = localStorage.getItem("token");
      if (token) {
        delete axios.defaults.headers.common["Authorization"];
        localStorage.clear();
        showModal();
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axios;
