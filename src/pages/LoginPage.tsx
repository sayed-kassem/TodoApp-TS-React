import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";

export default function LoginPage() {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogin = async (e: React.FormEvent) =>{
        e.preventDefault() 
        try{
            const userCred = await signInWithEmailAndPassword(auth, email, password)
            dispatch(login(userCred.user.email!));
            navigate("/")
            console.log("Login Success")

        }
        catch(err){
            console.log(err)
            alert("Login failed")
        }
        

    }

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="text" name="email" id="email" placeholder="email" className="form-control mb-2" onChange={e=> setEmail(e.target.value)} />
                <input type="password" name="password" id="password" placeholder="password"  className="form-control mb-2" onChange={e=>setPassword(e.target.value)}/>
                <button className="btn btn-primary" type="submit">Login</button>
            </form>
        </div>
    )
}