/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

/* Component for Users list displaying, not actually in use */
 
const Dashboard = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]);
    const history = useNavigate();
 
    useEffect(() => {
        refreshToken();
        getUsers();
    }, []);
 
    const refreshToken = async () => {
        try {
            const response = await axios.get('/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                history("/");
            }
        }
    }
 
    const axiosJWT = axios.create();
 
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
 
    const getUsers = async () => {
        const response = await axiosJWT.get('/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setUsers(response.data);
    }
 
    return (
        <div className="h-screen w-screen bg-gradient-to-br from-slate-400 to-slate-600">
            <h1>Welcome Back: {name}</h1>
            <table className="table-auto text-center w-screen">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
 
                </tbody>
            </table>
        </div>

    )
}
 
export default Dashboard