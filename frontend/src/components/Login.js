import React, { useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
 
const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
 
    // Function to check login
    const Auth = async (e) => {
        e.preventDefault();
        try {
            // We send the data to server to check
            await axios.post('/login', {
                email: email,
                password: password
            });
            // If the login informations are right, we retrieve and set the access token
            const response = await axios.get('/token');
            props.setToken(response.data.accessToken);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
 
    return (
        <div className='container items-ceter flex flex-col h-screen w-screen'>
            <div className="container text-xl scale-110 flex flex-col items-center text-white inset-y-1/4 relative w-screen">
                <form onSubmit={Auth} className="">
                    <p className="">{msg}</p>
                    <div className="mt-5">
                        <label className="label">Email or Username</label>
                        <div>
                            <input type="text" className="input rounded-lg pl-1 text-lg text-black" placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className="mt-5">
                        <label className="label">Password</label>
                        <div>
                            <input type="password" className="input rounded-lg pl-1 text-lg text-black" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="standardBtn inset-x-1/4 relative mt-5">
                        <button className="button is-success is-fullwidth">Login</button>
                    </div>
                    
                </form>
                <div className='text-center'>
                    <p className="text-lg">Don't have an account?<br /> <Link className="font-bold" to="/register">Register</Link> now.</p> {/* Link to navigate to the registration page */}
                </div>
            </div>
        </div>


    )
}
 
export default Login