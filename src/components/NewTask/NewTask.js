import { useCallback, useState } from "react";

import Section from "../UI/Section";
import TaskForm from "./TaskForm";
import useHttp from "../../hooks/use-http";

const NewTask = (props) => {
  const { isLoading, error, sendRequest: sendTaskRequest } = useHttp();
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  // taskText is not available here inside createTask but its available inside enterTaskHandler that's called from TaskForm component
  // to make it available inside createTask function which we pass to sendRequest: sendTaskRequest, we can
  // 1. define createTask fucntion inside enterTaskHandler function (but too many deep nested function)
  // 2. pass taskText as a first of two parameters to creatTask when actually useHttp hook has appyData() function make to accept only one argument (data)
  // for this we could use the bind() method in JS. bind() method allows us to preconfigure the function. it does not execute the function right away.
  // this first rgument you pass to bind, allows you set the 'this' keyword in the to be executed function, which does not matter here. So pass 'null' as first argument to bind()
  // but the second argument you pass to bind will then be the first argument received byt he to be called function. so pass 'taskText' as a second arguemnt to bind()

  // const createTask = (taskData) => {
  const createTask = (taskText, taskData) => {
    const generatedId = taskData.name; // firebase-specific => "name" contains generated id
    const createdTask = { id: generatedId, text: taskText };

    props.onAddTask(createdTask);
  };

  // const enterTaskHandler = async (taskText) => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const response = await fetch(
  //       "https://game-guides-8ea88.firebaseio.com/tasks.json",
  //       {
  //         method: "POST",
  //         body: JSON.stringify({ text: taskText }),
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Request failed!");
  //     }

  //     const data = await response.json();

  //     const generatedId = data.name; // firebase-specific => "name" contains generated id
  //     const createdTask = { id: generatedId, text: taskText };

  //     props.onAddTask(createdTask);
  //   } catch (err) {
  //     setError(err.message || "Something went wrong!");
  //   }
  //   setIsLoading(false);
  // };

  // no need to work with useCallback here as we are using sendRequest: sendTaskRequest inside a function thats  called on button click (form is submitted), not inside any useEffect
  // so we would not have a problem of an infinite loop
  const enterTaskHandler = async (taskText) => {
    sendTaskRequest(
      {
        url: "https://game-guides-8ea88.firebaseio.com/tasks.json",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { text: taskText },
      },
      createTask.bind(null, taskText)
    );
  };

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};

export default NewTask;
