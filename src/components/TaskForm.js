import React from 'react';

const TaskForm = (props) => {
  const { name, handleInputChange, createTask, isEditing, updateTask } = props;

  return (
    <form className='task-form' onSubmit={isEditing ? updateTask : createTask}>
      <input
        type='text'
        name='name'
        placeholder='Add a task'
        value={name}
        onChange={handleInputChange}
      />
      <button type='submit'>{isEditing ? 'Edit' : 'Add'}</button>
    </form>
  );
};

export default TaskForm;
