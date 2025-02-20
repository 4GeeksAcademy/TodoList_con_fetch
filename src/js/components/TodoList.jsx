import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const username = 'Antonio';

    const fetchTasks = () => {
        fetch(`https://playground.4geeks.com/todo/users/${username}`)
            .then(response => {
                if(!response.ok){
                    throw new Error(`Error HTTP: ${response.status}`)
                }
                return response.json();
            })
            .then(data => {
                setTasks(Array.isArray(data.todos) ? data.todos : []);
            })
            .catch(error => {
                console.error('Error al cargar las tareas:', error);
            });
    };

    useEffect(() => {
        fetchTasks();
    }, [username]);


    const handleAddTask = (e) => {
        if (e.key === 'Enter' && newTask.trim()) {
            const todo = {
                label: newTask,
                done: false, 
            };

            fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
                method: 'POST',
                body: JSON.stringify(todo),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    if (!response.ok) throw new Error('Error al crear la tarea');
                    return response.json();
                })
                .then(data => {
                    setNewTask('');
                   // setTasks([...tasks, data]);
                   fetchTasks();
                    
                })
                .catch(error => {
                    console.error('Error al crear la tarea:', error);
                });
        }
    };

    const handleDeleteTask = (id) => {

        fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al eliminar la tarea');
                fetchTasks();
            })
            .catch(error => {
                console.error('Error al eliminar la tarea:', error);
            });
    };


    const clearTodos = () => {
      
        if(tasks.length === 0){
            return;
        }
        Promise.all(
            tasks.map(task => {
                fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
                    method: 'DELETE',
                })
            })
        )
        .then(() => setTasks([]))
        .catch(error => {
            console.error('Error al limpiar las tareas:', error);
        });
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Lista de Tareas</h1>
            <input
                type="text"
                className="form-control mb-3"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={handleAddTask}
                placeholder="Añadir tarea"
            />
            <ul className="list-group">
                {tasks.length === 0 ? (
                    <li className="list-group-item">No hay tareas, añade una nueva tarea</li>
                ) : (
                    tasks.map((task, index) => (
                        <TodoItem
                            key={task.id}
                            task={task.label}
                            onDelete={() => handleDeleteTask(task.id)}
                        />
                    ))
                )}
            </ul>

            <div className="mt-3">
                {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'} pendiente{tasks.length !== 1 && 's'}
            </div>
            <button className="btn btn-danger mt-3" onClick={clearTodos}>
                Limpiar todas las tareas
            </button>
        </div>
    );
};

export default TodoList;
