import React, { useEffect, useState } from 'react';
import Task from './Task';
import TaskForm from './TaskForm';
import axios from 'axios';
import { toast } from 'react-toastify';
import loadingImage from '../assets/loader.gif';

// const backendURL = 'https://task-manager-backend-production.up.railway.app';
// "proxy": "http://localhost:5000",

const TaskList = () => {
  const defaultFormData = {
    name: '',
    completed: false,
  };
  const [formData, setFormData] = useState(defaultFormData);
  const { name } = formData;
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [taskID, setTaskID] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      if (name === '') {
        return toast.error('Input field cannot be empty.');
      }
      await axios.post(`/api/task`, formData);
      setFormData(defaultFormData);
      toast.success('Task added successfully.');
      getTasks();
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const getTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/task`);
      setTasks(data);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/task/${id}`);
      getTasks();
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const getSingleTask = async (id) => {
    try {
      setIsEditing(true);
      const { data } = await axios.get(`/api/task/${id}`);
      setFormData({ ...defaultFormData, name: data.name });
      setTaskID(data._id);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const updateTask = async (e) => {
    e.preventDefault();
    try {
      if (name === '') {
        toast.error('Input field can not be empty.');
      }
      await axios.put(`/api/task/${taskID}`, formData);
      setIsEditing(false);
      setFormData(defaultFormData);
      getTasks();
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const setToComplete = async (task) => {
    try {
      const newFormData = { name: task.name, completed: true };
      await axios.put(`/api/task/${task._id}`, newFormData);
      getTasks();
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    const completedTasks = tasks.filter((task) => task.completed);
    setCompletedTasks(completedTasks);
  }, [tasks]);

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        handleInputChange={handleInputChange}
        name={name}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      {tasks.length > 0 && (
        <div className='--flex-between --pb'>
          <p>
            <b>Total Tasks: </b>
            {tasks.length}
          </p>
          <p>
            <b>Completed Tasks: </b>
            {completedTasks.length}
          </p>
        </div>
      )}
      <hr />
      {isLoading && (
        <div className='--flex-center'>
          <img src={loadingImage} alt='Loading'></img>
        </div>
      )}
      {!isLoading && tasks.length === 0 && (
        <p className='--py'>No task added. Please add a task</p>
      )}
      {!isLoading &&
        tasks.length > 0 &&
        tasks.map((task, index) => (
          <Task
            key={task._id}
            index={index}
            task={task}
            deleteTask={deleteTask}
            getSingleTask={getSingleTask}
            setToComplete={setToComplete}
          />
        ))}
    </div>
  );
};

export default TaskList;
