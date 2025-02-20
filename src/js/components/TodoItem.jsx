import React from 'react';

const TodoItem = ({ task, onDelete }) => {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      {task}
      <button className="btn btn-danger btn-sm" onClick={onDelete}>Eliminar</button>
    </li>
  );
};

export default TodoItem;