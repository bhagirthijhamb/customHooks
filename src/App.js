import React, { useCallback, useEffect, useState } from "react";

import Tasks from "./components/Tasks/Tasks";
import NewTask from "./components/NewTask/NewTask";
import useHttp from "./hooks/use-http";

function App() {
  // managed by useHttp custom hook now
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);

  // data specific logic in the component that uses the useHttp hook
  // if using callBack in App.js is too cumbersome, pass transformTasks as a 2nd argument to fetchTasks (and create it inside useEffect, so it will not be expernal dependency)
  // and not to useHttp()
  // Transforms data received from DB and sets tasks state
  // this function will be called for us by the cusotm hook
  // so main logic in the custom hook
  // but the data specific logic in the component where we need the data

  // const transformTasks =(tasksObj) => {
  //   const loadedTasks = [];
  //   for (const taskKey in tasksObj) {
  //     loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
  //   }
  //   setTasks(loadedTasks);
  // }

  // const transformTasks = useCallback((tasksObj) => {
  //   const loadedTasks = [];
  //   for (const taskKey in tasksObj) {
  //     loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
  //   }
  //   setTasks(loadedTasks);
  // }, []); // no dependency as we just use set state function

  // use case for useMemo to ensure that the requestConfig object does not change(re-created) all the time (transformTasks function uses useCallback, so it will not change)
  // or we change the custom hook again to not acept requestConfig
  // instead of calling the useHttp with requestConfig, sendRequest function can be called with requestConfig as afterall that uses it
  const {
    isLoading,
    error,
    sendRequest: fetchTasks, // need to call this to trigger the request
    // } = useHttp(
    //   { url: "https://game-guides-8ea88.firebaseio.com/tasks.json" },
    //   transformTasks
    // );
    // } = useHttp(transformTasks); // move requestConfig (url) to fetchtasks() call inside useEffect
  } = useHttp(); // move transformTasks to fetchTasks (sendRequest) call inside useEffect() hook

  // const fetchTasks = async (taskText) => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const response = await fetch(
  //       "https://game-guides-8ea88.firebaseio.com/tasks.json"
  //     );

  //     if (!response.ok) {
  //       throw new Error("Request failed!");
  //     }

  //     const data = await response.json();

  //     const loadedTasks = [];

  //     for (const taskKey in data) {
  //       loadedTasks.push({ id: taskKey, text: data[taskKey].text });
  //     }

  //     setTasks(loadedTasks);
  //   } catch (err) {
  //     setError(err.message || "Something went wrong!");
  //   }
  //   setIsLoading(false);
  // };

  // useEffect(() => {
  //   fetchTasks();
  // }, []); // no dependencies as we call just state updating functions inside old fetchTasks

  // useEffect(() => {
  //   fetchTasks({ url: "https://game-guides-8ea88.firebaseio.com/tasks.json" }); // moved form useHttp() hook call to here
  // }, [fetchTasks]); // fetchTasks as dependency as React does not know sendRequest: fetchTasks function
  // need to use useCallback on senRequest: fetchTasks inside the useHttp cusotm hook
  // otherwise it will create an infinite loop as sendRequest fucntion will be re-created and it will be come back as a new object in memory

  useEffect(() => {
    // create transformTasks inside useEffect so that its not an external dependency inside useEffect
    const transformTasks = (tasksObj) => {
      const loadedTasks = [];
      for (const taskKey in tasksObj) {
        loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
      }
      setTasks(loadedTasks);
    };

    // now we are sending request specific configuration and the data transformation that should be applied after the request was sent, directly to the request
    fetchTasks(
      { url: "https://game-guides-8ea88.firebaseio.com/tasks.json" },
      transformTasks
    );
  }, [fetchTasks]);

  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </React.Fragment>
  );
}

export default App;
