import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

function Login() {

    const [id, setId] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post('/admin/auth/login', {
                id: id,
                password: password
            });
            if (response.status === 200) {
                console.log('Login successful:', response.data);
                alert('로그인 성공!');
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                navigate('/admin', { replace: false });
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    }

    return (
        <div>
            <h2>Admin Login Page</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="text" 
                    placeholder="ID" 
                    value={id} 
                    onChange={(e) => setId(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button type="submit">로그인</button>
            </form>
        </div>
    )
}

export default Login