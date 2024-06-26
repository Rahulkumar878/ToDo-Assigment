import React, { useEffect, useState } from "react";
import "./Todo.css";
import TodoCards from "./TodoCards";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Update from "./Update";
import axios from "axios";
import { useSelector } from "react-redux";
let toUpdateArray = [];
let id = sessionStorage.getItem("id");
const Todo = () => {
  const [inputs, setInputs] = useState({ title: "", body: "" });
  const [Array, setArray] = useState([]);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const id = sessionStorage.getItem("id");
  const show = () => {
    document.getElementById("textarea").style.display = "block";
  };
  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const submit = async () => {
    // console.log(inputs);
    if (inputs.title === "" || inputs.body === "") {
      toast.error("Title Or Body Can't Be Empty");
    } else {
      if (id) {
        await axios
          .post("http://localhost:1000/api/v2/addTask", {
            title: inputs.title,
            body: inputs.body,
            id: id,
          })
          .then((response) => {
            console.log(response);
          });
        // setArray([...Array, inputs]);
        setInputs({ title: "", body: "" });
        toast.success("Task Added");
      } else {
        setArray([...Array, inputs]);
        setInputs({ title: "", body: "" });

        toast.error("Task Added but not saved!Do signup");
      }
    }
  };
  const del = async (Cardid) => {
    if (id) {
      await axios
        .delete(`http://localhost:1000/api/v2/deleteTask/${Cardid}`, {
          data: { id: id },
        })
        .then(() => {
          toast.success("Yout Task Is Deleted Successfully");
        });
    } else {
      toast.success("Please SignUp First!!");
    }
  };

  const dis = (value) => {
    document.getElementById("todo-update").style.display = value;
  };
  const update = (value) => {
    toUpdateArray = Array[value];
  };
  useEffect(() => {
    if (id) {
      const fetch = async () => {
        await axios
          .get(`http://localhost:1000/api/v2/getTask/${id}`)
          .then((response) => {
            setArray(response.data.list);
          });
      };
      fetch();
    }
  }, [submit]);

  useEffect(() => {
    if (!isLoggedIn) {
      setArray([]);
      sessionStorage.clear(); // Clear session storage on logout
    }
  }, [isLoggedIn]);
  return (
    <>
      <div className="todo">
        <ToastContainer />
        <div className="todo-main container d-flex justify-content-center align-items-center my-4 flex-column">
          <div className="d-flex flex-column todo-inputs-div w-lg-50 w-100 p-1">
            <input
              type="text"
              placeholder="TITLE"
              className="my-2 p-2 todo-inputs"
              onClick={show}
              name="title"
              value={inputs.title}
              onChange={change}
            />
            <textarea
              type="text"
              placeholder="BODY"
              id="textarea"
              name="body"
              className=" p-2 todo-inputs"
              value={inputs.body}
              onChange={change}
            />
          </div>
          <div className=" w-50 w-100 d-flex justify-content-end my-3">
            <button className="home-btn px-2 py-1" onClick={submit}>
              Add
            </button>
          </div>
        </div>
        <div className="todo-body">
          <div className="container-fluid">
            <div className="row">
              {Array &&
                Array.map((item, index) => (
                  <div
                    key={index}
                    className="col-lg-3 col-11 mx-lg-5 mx-3 my-2"
                  >
                    <TodoCards
                      title={item.title}
                      body={item.body}
                      id={item._id}
                      delid={del}
                      display={dis}
                      updateId={index}
                      toBeUpdate={update}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="todo-update " id="todo-update">
        <div className="container update">
          <Update display={dis} update={toUpdateArray} />
        </div>
      </div>
    </>
  );
};

export default Todo;
