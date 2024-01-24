/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { getUserPermit } from './Utilities';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

 
const Navbar = (props) => {
    const [user, setUser] = useState('');
    const [userId, setUserId] = useState(null)
    const [permit, setPermit] = useState(null)
    const navigate = useNavigate()

    // On a new token the application automatically updates user to show his name on the Navbar
    useEffect(() => {
        if(props.token !== undefined && props.token !== null)
            userName()
        else
            setUser('')
    }, [props.token]);

    useEffect(() => {
        if(userId !== '')
            getUserPermit(userId).then((res) => setPermit(res))
    },[userId])

    // Function to retrieve user's name and id from the token 
    const userName = async () => {
            const decoded = jwt_decode(props.token);
            setUser(decoded.name);
            setUserId(decoded.userId)
    }

    // Function for logout, calls token remotion and navigate to root page
    const Logout = async () => {
        try {
            await axios.delete('/logout');
            props.rmToken()
            navigate('/')
        } catch (error) {
            console.log(error);
        }
    }
 
    return (
        
        <div className="container flex flex-row justify-between bg-gray-400 py-2 px-5 w-screen items-center fixed z-10">
            <div>
                <Link className='text-4xl font-bold underline text-green-700' to="/">EasyTask</Link>
            </div>

            <div className='flex flex-row gap-8 justify-center'>
                <div className='text-sm text-white font-bold'>
                    {permit === 1 && user !== ''
                        ? <p>Admin<br/>{userId}</p>
                        : <p>Base<br/>{userId}</p>
                    }
                </div>
                <h3 className='text-white font-bold text-2xl'>{user}</h3>
                <button onClick={Logout} className="text-white py-1 px-3 mr-6 w-32 standardBtn">
                    Log Out
                </button>
            </div>
                            
        </div>
    )
}
 
export default Navbar