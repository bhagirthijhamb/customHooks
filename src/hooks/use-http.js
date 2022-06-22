import React, { useState, useCallback } from "react";

// this hook should be abele to send any kind of request to any kind of url and
// do any kind of data transformation
// but it should manage the same state, loading an error and execute the steps in the same order.
// we'll need parameters to make this hook configurable
// const useHttp = (requestConfig, applyData) => {
// const useHttp = (applyData) => { // move requestConfig to sendRequest
const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // const sendRequest = useCallback(async () => {
  // const sendRequest = useCallback(
  //   async (requestConfig) => {
  const sendRequest = useCallback(
    async (requestConfig, applyData) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(requestConfig.url, {
          method: requestConfig.method ? requestConfig.method : "GET",
          headers: requestConfig.headers ? requestConfig.headers : {},
          body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
        });

        if (!response.ok) {
          throw new Error("Request failed!");
        }

        const data = await response.json();

        applyData(data);
      } catch (err) {
        setError(err.message || "Something went wrong!");
      }
      setIsLoading(false);
    },
    // [requestConfig, applyData] // both are object, so make sure these are not recreated when App component function runs again.
    // [appyData] // remove requestConfig as it's moved from useHttp to sendRequest
    [] //no more dependencies for useCallback as all the data its operating on is received as parameters in the wrapped functions (sendRequest)
  );
  return { isLoading, error, sendRequest };
};

export default useHttp;
