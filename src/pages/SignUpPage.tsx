import { createUserWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../services/firebase"
import { useDispatch } from "react-redux"
import { login } from "../features/auth/authSlice"

export default function SignUpPage() {

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const navigate = useNavigate()
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try{
            const userCred = await createUserWithEmailAndPassword(auth,email,password);
            dispatch(login(userCred.user.email!));
            console.log("Signup Success")
            navigate("/")
        }
        catch(err){
            console.log(err)
            alert("Signup failed")
        }
    }

    return (
        <div className="container mt-5">
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="email" id="email" placeholder="email" className="form-control mb-2" onChange={e=>setEmail(e.target.value)} />
                <input type="password" name="password" id="password" placeholder="password"  className="form-control mb-2" onChange={e=>setPassword(e.target.value)}
                />
                <button className="btn btn-success" type="submit">Sign Up</button>
            </form>
        </div>
    )
}