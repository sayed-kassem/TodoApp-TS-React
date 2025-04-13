import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import TodoPage from "../pages/TodoPage";

export default function AppRouter() {
  return (
    <Routes> 
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignUpPage/>}/>
        <Route path="/" element={<TodoPage/>}/>
    </Routes>

)
}