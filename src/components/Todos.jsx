import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePen, faFileArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faRectangleXmark } from "@fortawesome/free-regular-svg-icons";
import { addTodos, addSingleTodo } from "../features/todoSlice";
import todoService from "../appwrite/todoService";

function Todos() {
  const { register, handleSubmit, reset, control } = useForm();
  const user = useSelector((state) => state.auth.userData);
  const todos = useSelector((state) => state.todo.todos);
  const [todoColors, setTodoColors] = useState([]);
  const [isEdit, setIsEdit] = useState({});
  const [error,setError] = useState("");
  const dispatch = useDispatch();

  // Function to generate random colors
  function generateRandomColorWithShades() {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;

    function adjustBrightness(color, amount) {
      const hex = color.startsWith("#") ? color.slice(1) : color;
      let r = parseInt(hex.substring(0, 2), 16);
      let g = parseInt(hex.substring(2, 4), 16);
      let b = parseInt(hex.substring(4, 6), 16);

      r = Math.min(Math.max(0, r + amount), 255);
      g = Math.min(Math.max(0, g + amount), 255);
      b = Math.min(Math.max(0, b + amount), 255);

      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

    const lighterShade = adjustBrightness(randomColor, 120);
    const darkerShade = adjustBrightness(randomColor, -100);

    return {
      baseColor: randomColor,
      lighterShade,
      darkerShade,
      borderColor: adjustBrightness(randomColor, -120),
      textColor: randomColor,
    };
  }

  function todoAlreadyExist(data) {
    return todos.some((todo) => todo.todo === data.todo);
  }

  function clearError(){
    setError("");
  }

  async function addTodo(data) {
    try {
      if(todoAlreadyExist(data)) {
        setError("! Todo Already Exist")
        return
      };
      const response = await todoService.addTodo({
        ...data,
        userId: user.$id,
      });

      if (response) {
        dispatch(addSingleTodo(response));
        setTodoColors((prev) => {
          return { ...prev, [response.$id]: generateRandomColorWithShades() }
        })
      }
      reset();
    } catch (error) {
      console.error(error.message);
    }
  }

  async function deleteTodo(id) {
    try {
      await todoService.removeTodo(id);
      setTodoColors((prev) => {
        const newColors = { ...prev };
        delete newColors[id];
        return newColors;
      })
      dispatch(addTodos(todos.filter((todo) => todo.$id !== id)));
    } catch (error) {
      console.error(error.message);
    }
  }

  async function updateTodo(id, updatedTodo) {
    try {
      if (isEdit[id]) {
        await todoService.updateTodo(id, updatedTodo);
        dispatch(addTodos(todos.map((todo) => todo.$id === id ? { ...todo, todo: updatedTodo } : todo)));
      }
      setIsEdit((prev) => ({ ...prev, [id]: !prev[id] }));
    } catch (error) {
      console.error(error.message);
    }
  }

  const handleCheckboxChange = async (todoId, isChecked) => {
    try {
      await todoService.updateTodoStatus(todoId, isChecked);
      dispatch(
        addTodos(
          todos.map((todo) =>
            todo.$id === todoId ? { ...todo, isCompleted: isChecked } : todo
          )
        )
      );
    } catch (error) {
      console.error("Error updating todo status:", error);
    }
  };

  useEffect(() => {
    if(todos.length >0) return;
    todoService
      .getTodos(user.$id)
      .then((response) => {
        dispatch(addTodos(response.documents));
        const colors = {};
        response.documents.forEach(todo => {
          colors[todo.$id] = generateRandomColorWithShades();
        });
        setTodoColors(colors);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  return (
    <div className="flex justify-center min-w-full bg-main-dark-bg min-h-screen py-10">
      <div className="w-full max-w-3xl mx-4">
        {/* Form Section */}
        <div className="flex justify-center mb-6">
          <form onSubmit={handleSubmit(addTodo)}>
            {error && <p className="text-left text-red-500">{error}</p>}
            <div className="flex items-center space-x-4 pt-4 pb-12">
              
              <input
                className=" w-[240px] md:w-[500px] bg-sideBar text-white text-sm md:text-lg px-3 md:px-5 py-1 md:py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 ease-in-out h-[50px] md:h-[60px]"
                type="text"
                onInput={clearError}
                placeholder="Enter your todo"
                {...register("todo", { required: "Todo is required" })}
              />
              <button className="bg-blue-950 text-blue-400 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-3 md:px-5 py-[9px] md:py-[14px] rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                <span className="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                Add
              </button>
            </div>
          </form>
        </div>

        {/* Todo List Section */}
        <div className="space-y-4">
          {todos &&
            todos.map((todo) => {
              const randColor = todoColors[todo.$id] || generateRandomColorWithShades();

              return (
                <div
                  key={todo.$id}
                  role="alert"
                  style={{
                    backgroundColor: randColor.darkerShade,
                    borderLeft: `6px solid ${randColor.borderColor}`,
                    color: randColor.lighterShade,
                  }}
                  className="w-full md:px-6 md:py-4 p-[8px] rounded-lg flex items-center transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center justify-center">
                      <Controller
                        name={`todos[${todo.$id}].isCompleted`}
                        control={control}
                        defaultValue={todo.isCompleted || false}
                        render={({ field }) => (
                          <>
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                field.onChange(e.target.checked); // Updates React Hook Form state
                                handleCheckboxChange(todo.$id, e.target.checked); // Calls your function
                              }}
                              className="md:mr-5 mr-[12px] cursor-pointer md:w-5 w-[14px] h-5 accent-blue-400"
                              checked={field.value}
                            />
                            {isEdit[todo.$id] ? (
                              <input type="text"
                                id={`todo-input-${todo.$id}`}
                                defaultValue={todo.todo}
                                className="bg-transparent text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 ease-in-out"
                              />
                            ) : (
                              <p className={`text-xs md:text-base font-medium ${field.value ? "line-through" : ""}`}>
                                {todo.todo}
                              </p>
                            )}

                          </>
                        )}
                      />
                    </div>
                    <div>
                      <FontAwesomeIcon
                        icon={isEdit[todo.$id] ? faFileArrowUp : faSquarePen}
                        className={`text-xl md:text-3xl mx-[3px] md:mx-3 ${todo.isCompleted ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"
                          }`}
                        onClick={() => {
                          if (!todo.isCompleted) {
                            if (isEdit[todo.$id]) {
                              // Save the updated text
                              const updatedText = document.getElementById(`todo-input-${todo.$id}`).value;
                              updateTodo(todo.$id, updatedText);
                            } else {
                              // Toggle edit mode
                              setIsEdit((prev) => ({ ...prev, [todo.$id]: true }));
                            }
                          }
                        }}
                      />

                      <FontAwesomeIcon
                        icon={faRectangleXmark}
                        className="text-xl md:text-3xl mx-[3px] md:mx-3 cursor-pointer"
                        onClick={() => deleteTodo(todo.$id)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Todos;
