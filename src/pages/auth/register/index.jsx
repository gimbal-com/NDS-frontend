import { Button, Input, message, Select } from "antd"
import { useState } from "react"
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../../store/user/userSlice";

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accountType, setAccountType] = useState("pilot");

    const handleSubmit = async () => {
        if(username && email && password && accountType) {
            let response = await dispatch(register({username, email, password, accountType}));
            
            if(register.fulfilled.match(response)) {
                message.success("You are signed up successfully.");
                navigate('/auth/login');
            }
        } else {
            message.info("Please input all fields.");
        }
    }

    return (
        <div className="auth-content">
            <h4 className="auth-title">Register Page</h4>
            <Input onChange={e => setUsername(e.target.value)} placeholder="Username" className="auth-input" value={username} />
            <Input onChange={e => setEmail(e.target.value)} placeholder="Email" className="auth-input" value={email} />
            <Input.Password onChange={e => setPassword(e.target.value)} placeholder="Password" className="auth-input" value={password} />
            <Select 
                onChange={value => setAccountType(value)} 
                placeholder="Account Type"
                value={accountType}
                options={[
                    {value: 'client', label: 'Client'},
                    {value: 'pilot', label: 'Pilot'}
                ]} 
                className="auth-input"
            />
            <p className="auth-tip">
                Already have an account? 
                <Link style={{marginLeft: 8}} to={'/auth/login'}>Sign in</Link>
            </p>
            <Button className="auth-submit-btn" type="primary" onClick={handleSubmit}>Submit</Button>
        </div>
    )
} 

export default RegisterPage;