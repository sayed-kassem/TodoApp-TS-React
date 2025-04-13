import { useNavigate } from "react-router-dom";
import { RootState } from "../app/store"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react";
import { logout } from "../features/auth/authSlice";

export default function TodoPage() {

    const user = useSelector((state: RootState) => state.auth.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(()=> {
        if(!user) {
            navigate("/login")
        }
    }, [user, navigate])

    const handleLogout= () =>{
        dispatch(logout())
        navigate("/login")
    }

    return (
        <div className="container mt-5">

            <h2>Todo Page</h2>
            <div className="d-flex justify-content-between align-items-center">
                <h2>Hello, {user}</h2>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
                </button>
            </div>
            <form action="" method="post">
                <input type="text" name="todo" id="todo" placeholder="todo" className="form-control mb-2" />
                <button className="btn btn-primary" type="submit">Add Todo</button>
            </form>
        </div>
    )
}