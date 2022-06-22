import React, { useCallback, useEffect, useState } from "react";

import Tasks from "./components/Tasks/Tasks";
import NewTask from "./components/NewTask/NewTask";
import useHttp from "./hooks/use-http";

function App() {
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);

  // data specific logic in the component that uses the useHttp hook
  // if using callBack in App.js is too cumbersome, pass transformTasks as a 2nd argument to fetchTasks (and create it inside useEffect, so it will not be expernal dependency)
  // and not to useHttp()
  // const transformTasks = useCallback((tasksObj) => {
  //   const loadedTasks = [];
  //   for (const taskKey in tasksObj) {
  //     loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
  //   }
  //   setTasks(loadedTasks);
  // }, []);

  // use case for useMemo to ensure that this object does not change(re-created) all the time
  const {
    isLoading,
    error,
    sendRequest: fetchTasks,
    // } = useHttp(
    //   { url: "https://game-guides-8ea88.firebaseio.com/tasks.json" },
    //   transformTasks
    // );
    // } = useHttp(transformTasks);
  } = useHttp();

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
  // }, []);

  // useEffect(() => {
  //   fetchTasks({ url: "https://game-guides-8ea88.firebaseio.com/tasks.json" });
  // }, [fetchTasks]);

  useEffect(() => {
    const transformTasks = (tasksObj) => {
      const loadedTasks = [];
      for (const taskKey in tasksObj) {
        loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
      }
      setTasks(loadedTasks);
    };

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
