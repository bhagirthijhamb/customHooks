import React, { useState, useCallback } from "react";

// const useHttp = (requestConfig, appyData) => {
// const useHttp = (appyData) => {
const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // const sendRequest = useCallback(async () => {
  // const sendRequest = useCallback(
  //   async (requestConfig) => {
  const sendRequest = useCallback(
    async (requestConfig, appyData) => {
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

        appyData(data);
      } catch (err) {
        setError(err.message || "Something went wrong!");
      }
      setIsLoading(false);
    },
    // [requestConfig, appyData]
    // [appyData]
    [] //no more dependencies for useCallback as all the data its operating on is received as parameters in the wrapped funcitons
  );
  return { isLoading, error, sendRequest };
};

export default useHttp;
