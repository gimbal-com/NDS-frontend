import { Button, Input, message } from "antd"
import { useState } from "react"
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../store/user/userSlice";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        if(username && password) {
            let response = await dispatch(login({username, password}));
            
            if(login.fulfilled.match(response)) {
                message.success("You are signed in successfully.");
                // navigate('/auth/login');
            }
        } else {
            message.info("Please input all fields.");
        }
    }

    return (
        <div className="auth-content">
            <h4 className="auth-title">Login Page</h4>
            <Input onChange={e => setUsername(e.target.value)} placeholder="Username" className="auth-input" value={username} />
            <Input.Password onChange={e => setPassword(e.target.value)} placeholder="Password" className="auth-input" value={password} />
            <p className="auth-tip">
                Haven't account yet? 
                <Link style={{marginLeft: 8}} to={'/auth/register'}>Register</Link>
            </p>
            <Button className="auth-submit-btn" type="primary" onClick={handleSubmit}>Submit</Button>
        </div>
    )
} 

export default LoginPage;