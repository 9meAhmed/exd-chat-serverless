import { useState, useEffect } from "react";
import axios from "axios";

// Custom hook for API calls with request cancellation and interceptors
const useAxios = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Create an Axios instance
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true,
  });

  // Set up request and response interceptors
  axiosInstance.interceptors.request.use(
    (config) => {
      // Log or modify request here
      console.log("Sending request to:", config.url);
      return config;
    },
    (error) => {
      // Handle request error here
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      // Log or modify response here
      console.log("Received response from:", response.config.url);
      return response;
    },
    async (error) => {
      console.log("previous request", error.config);
      const prevRequest = error?.config;

      if (
        (error?.response?.status === 403 || error?.response?.status === 401) &&
        !prevRequest._retry
      ) {
        prevRequest._retry = true;

        // try {
        //   await axiosInstance.post("/refresh", {}, { withCredentials: true });

        //   return axiosInstance(prevRequest);
        // } catch (refreshError) {
        //   console.error("Refresh token failed:", refreshError);
        //   return Promise.reject(refreshError);
        // }
      }

      // Handle response error here
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const source = axios.CancelToken.source();

    return () => {
      // Cancel the request when the component unmounts
      source.cancel("Component unmounted: Request cancelled.");
    };
  }, []);

  // Making the API call with cancellation support
  const fetchData = async ({ url, method, data = {}, params = {} }) => {
    setLoading(true);
    try {
      const result = await axiosInstance({
        url,
        method,
        data: method.toLowerCase() === "get" ? undefined : data, // Only include data for non-GET requests
        params: method.toLowerCase() === "get" ? data : params, // For GET requests, use data as query params
        cancelToken: axios.CancelToken.source().token,
      });

      setResponse(result.data);
    } catch (error) {
      console.log(error);
      if (axios.isCancel(error)) {
        console.log("Request cancelled", error.message);
      } else if (axios.isAxiosError(error)) {
        const responseData =
          error.response && error.response.data
            ? error.response.data
            : error.message;
        setError(
          typeof responseData === "string"
            ? responseData
            : JSON.stringify(responseData)
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    } finally {
      setLoading(false);
    }
  };

  // Expose the state and the fetchData function
  return { response, error, loading, fetchData };
};

export default useAxios;
