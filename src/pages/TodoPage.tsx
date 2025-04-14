import { useNavigate } from "react-router-dom";
import { RootState } from "../app/store"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { logout } from "../features/auth/authSlice";
import { addTodoToDB, deleteTodoDB, fetchTodos, toggleTodoDB } from "../features/todos/todoSlice";

export default function TodoPage() {

    const [newTodo, setNewTodo] = useState("")
    const {todos, loading} = useSelector((state: RootState) => state.todos);


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

    return (
        <div className="container mt-4">
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

            {loading ? (
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ): (
                <ul className="list-group">
                    {todos.map((todo) => (
                        <li key={todo.id} 
                            className={`list-group-item d-flex justify-content-between ${todo.completed} ? "text-decoration-line-through" :""`}>
                             
                             <span onClick={()=>handleToggle(todo.id, todo.completed)} style={{cursor:"pointer"}}>{todo.text}</span>
                            <button className="btn btn-sm btn-danger" onClick={()=> handleDelete(todo.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
}