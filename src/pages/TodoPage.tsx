/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { RootState } from "../app/store"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { logout } from "../features/auth/authSlice";
import { addTodoToDB, deleteTodoDB, editTodoInDB, fetchTodos, setFilter, toggleTodoDB } from "../features/todos/todoSlice";
import { Todo } from "../features/todos/todoSlice";


import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "react-bootstrap-icons";

export default function TodoPage() {

    const [newTodo, setNewTodo] = useState("")
    const {todos, loading} = useSelector((state: RootState) => state.todos);

    const filter = useSelector((state: RootState) => state.todos.filter);

    const filteredTodos = todos.filter((todo)=> {
        if(filter === "all") return true;
        if(filter === "active") return !todo.completed;
        if(filter === "completed") return todo.completed;
    })

    const [showModal, setShowModal] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [editingText, setEditingText] = useState("");

    const user = useSelector((state: RootState) => state.auth.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(()=> {
        if(!user) {
            navigate("/login")
        }
        else{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dispatch(fetchTodos(user) as any)
        }
    }, [user, dispatch, navigate])

    const handleLogout= () =>{
        dispatch(logout())
        navigate("/login")
    }

    const handleAdd = () => {
        if(newTodo.trim()){
                 
            if (user) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                dispatch(addTodoToDB({text: newTodo, userId: user}) as any);
            }
            setNewTodo("")
        }
    }

    const handleToggle = (id: string, completed: boolean) =>{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(toggleTodoDB({id, completed}) as any)
    }

    const handleDelete = (id: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(deleteTodoDB(id) as any);
    }

    const handleEdit = (todo: Todo) =>{
        setEditingTodo(todo);
        setEditingText(todo.text);
        setShowModal(true);
        console.log(editingTodo, showModal)
    }

    const handleSave = () =>{
        if(editingTodo && editingText.trim()) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dispatch(editTodoInDB({id: editingTodo.id, text: editingText}) as any);
            setEditingTodo(null);
            setShowModal(false);
        }
    }

    const handleCancel = () =>{
        setShowModal(false);
        setEditingTodo(null);
    }

    const {theme, toggleTheme} = useTheme()


    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-end mb-2">
                <button onClick={toggleTheme} className="btn btn-outline-secondary" title="Toggle Theme">{theme === "dark" ? <Sun/> : <Moon/>}</button>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Hello, {user}</h3>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <div className="input-group mb-3">
                <input type="text" className="form-control" value={newTodo}  onChange={(e)=> setNewTodo(e.target.value)} placeholder="New Todo"/>
                <button className="btn btn-primary" onClick={handleAdd}>Add</button>
            </div>

            <div className="btn-group mb-3 ">
                <button
                onClick={()=> dispatch(setFilter("all"))}
                className={`btn btn-${filter === "all" ?"primary": "outline-primary"}`}
                >
                    All
                </button>

                <button
                onClick={()=> dispatch(setFilter("active"))}
                className={`btn btn-${filter === "active" ?"primary": "outline-primary"}`}
                >
                    Active
                </button>

                <button
                onClick={()=> dispatch(setFilter("completed"))}
                className={`btn btn-${filter === "completed" ?"primary": "outline-primary"}`}
                >
                    Completed
                </button>

            </div>

            {loading ? (
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ): (
                <ul className="list-group">
                    {filteredTodos.map((todo) => (
                        <li key={todo.id} 
                            className={`list-group-item d-flex flex-row justify-content-between align-items-center`}>
                             
                             <div className="justify-content-start p">
                             <input
                                type="checkbox"
                                className="form-check-inpu me-2"
                                id={`todo-${todo.id}`}
                                checked={todo.completed}
                                onChange={() => dispatch(toggleTodoDB({id: todo.id, completed: todo.completed})as any)}
                            />
                             <span onClick={()=>handleToggle(todo.id, todo.completed)} style={{cursor:"pointer"}} className={`form-check-label ${todo.completed ? "text-decoration-line-through text-muted opacity-50" : ""}`}
                             >{todo.text}</span>
                            
                             </div>
                            <div className="flex-row-reverse">
                            <button className="btn btn-outline-success btn-sm me-2" onClick={()=> handleEdit(todo)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={()=> handleDelete(todo.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )
            }

            { showModal && (
                    <div className={`modal fade d-flex justify-content-center ${showModal ? "show d-block" : ""}`}
                    tabIndex={-1}
                    role="dialog"
                    style={{backgroundColor: "rgba(0,0,0,0.5)"}}
                    >
                        <div className="modal-dialog align-content-center w-75" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Todo</h5>
                                    <button type="button" className="btn-close" onClick={handleCancel}></button>
                                </div>
                                <div className="modal-body">
                                    <input type="text" className="form-control" value={editingText} onChange={(e)=> setEditingText(e.target.value)}/>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSave}
                                    >
                                    Save changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
        