import React, { useState } from 'react'
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
 
const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [msg, setMsg] = useState('');
    const history = useNavigate();

    // Function for registration
    const Register = async (e) => {
        e.preventDefault();
        try {
            // We post the registration datas to server
            await axios.post('/users', {
                name: name,
                email: email,
                password: password,
                confPassword: confPassword
            });
            // Then we navigate to main page
            history("/");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
 
    return (
        <div className="items-ceter flex flex-col min-h-screen w-screen">
            <div className=" text-xl scale-110 flex flex-col items-center text-white mt-16 relative w-screen">
                <form onSubmit={Register} className="box mt-5">
                    <p className="has-text-centered">{msg}</p>
                    <div className="mt-5">
                        <label>Name</label>
                        <div className="controls">
                            <input type="text" className="input text-black rounded-lg pl-1" placeholder="Name"
                                value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                    </div>
                    <div className="mt-5">
                        <label>Email</label>
                        <div className="controls">
                            <input type="text" className="input text-black rounded-lg pl-1" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className="mt-5">
                        <label>Password</label>
                        <div className="controls">
                            <input type="password" className="input text-black rounded-lg pl-1" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="mt-5">
                        <label>Confirm Password</label>
                        <div className="controls">
                            <input type="password" className="input text-black rounded-lg pl-1" placeholder="******" value={confPassword} onChange={(e) => setConfPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="standardBtn inset-x-1/4 relative mt-5">
                        <button className="button is-success is-fullwidth">Register</button>
                    </div>
                </form>
                <div className='text-center mt-2'>
                    <p className="text-lg">Already have an account?<br /> <Link className="font-bold" to="/">Login</Link> now.</p>
                </div>
            </div>    
        </div>                
    )
}
 
export default Register