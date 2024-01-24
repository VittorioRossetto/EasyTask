/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import Moment from 'moment';
import { getUserPermit, getUserName } from './Utilities';
import dateFormat from 'dateformat';

/* 
    Main page displaying current user's open projects,
    if the current user is an admin, there's also the project creation area
*/

export default function ProjectTable(props) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [permit, setPermit] = useState(null)
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [contributorsNames, setContributorsNames] = useState([]);
    const [description, setDescription] = useState('')
    const [msg, setMsg] = useState('');
    const [name, setName] = useState('');
    const [/* removed */, setRemoved] = useState('')
    
    // On page loading we call functions to set token and User
    useEffect(() => {
        refreshToken();
        getUsers();
    },[])

    // After the User is set, we retrieve his permit level
    useEffect(() => {
        if(user !== '')
            getUserPermit(user).then((res) => setPermit(res))
    }, [user])

    // Log the project list
    useEffect(() => {
        if(projects.length > 0)
            console.log(projects)
    }, [projects])

    // After we retrieved contributors, we set their names
    useEffect(() => {
        if(contributors.length > 0) {
            console.log(contributors)
            getUserName(contributors[contributors.length - 1]).then((Username) => 
                setContributorsNames(contributorsNames => [...contributorsNames, Username])
            )
            
        }       
    }, [contributors])

    //  Log the contributors names list
    useEffect(() => {
        if(contributorsNames.length > 0)
            console.log(contributorsNames)
    }, [contributorsNames])

    // After the user is set, we retrieve the projects
    useEffect(() => {
        if(user !== null)
            getProjects();
    }, [user]);

    // 
    const refreshToken = async () => {
        try {
            const response = await axios.get('/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setUser(decoded.userId);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                navigate("/");
            }
        }
    }

    // Function that calls the server to retrieve projects
    const getProjects = async () => {
        const response = await axios.get('/projects?user_id=' + user, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setProjects(response.data);
    }

    const axiosJWT = axios.create();
 
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            /* setUser(decoded.id); */
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    // Function that calls server to retrieve Users
    const getUsers = async () => {
        const response = await axiosJWT.get('/users', {
        });
        setUsers(response.data);
    }

    // Function for project creation
    const addProj = async (e) => {
        e.preventDefault()

        // First we create the project object to add
        const obj = {
            name: name,
            description: description,
            creation_date: Moment().format("DD-MM-YYYY"), // Current date
            tasks: [],
            creator: user,
            contributors: contributors    
        }
        console.log(obj);
        try {
            await axios.post('/projects', obj );
            /* After the project is created we retrieve projects again 
                and we empty the project creation data */
            getProjects()
            setName('')
            setDescription('')
            setContributors([])
            
        } catch (error) {
            if(error.response) {
                setMsg(error.response.data.msg)
            }
        }
    }

    // function to format contributors ids so they appear as 1, 2, 3, ...
    const formatContributors = (str) => {
        const contArray = JSON.parse(str)
        let tmp = ''
        for (let i = 0; i < contArray.length; i++) {
            tmp = tmp + contArray[i];
            if(i < contArray.length - 1)
                tmp = tmp + ', '  
        }
        return tmp
    }

    /* const addContributor = (person) => {
        let addable = true
        contributors.forEach(element => {
            if(person === element)
                addable = false
        });
        if(addable)
            setContributors(contributors => [...contributors, person])
            addable = true
    } */

    return (
        <div className='min-h-screen pt-5 w-screen'>
            <h1 className='mt-10 ml-5 mb-2 text-white font-bold text-2xl'>Your open Projects:</h1>
            <div className='max-h-64 scrollbar scrollbar-thumb-gray-900 scrollbar-thumb-rounded-xl left-[12.5%] w-[75%] relative rounded-xl'>
                <table className="table-auto w-[100%] text-center text-white bg-white bg-opacity-10 ">
                    <thead className='bg-white h-14 bg-opacity-5 text-gray-700 sticky'>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Created</th>
                            <th>Creator</th>
                            <th>Contributors</th>
                            <th>    </th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project, index) => (
                            <tr key={project.id} className='bg-white h-12 bg-opacity-0 hover:bg-opacity-5 duration-500'>
                                <td>{project.id}</td>
                                <td>{project.name}</td>
                                <td>{dateFormat(project.creation_date, "mm/dd/yyyy")}</td>
                                <td>{project.creator}</td>
                                <td>{formatContributors(project.contributors)}</td>
                                <td>
                                    <button className='standardBtn text-sm px-3' onClick={(e) => navigate('/project/' + project.id)}>Open</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {permit === 1 &&
                <div className='w-screen h-screen'>
                    <h1 className='mt-5 ml-5 mb-2 text-white font-bold text-2xl'>Create a new Project:</h1>
                    <div className='grid grid-cols-2 ml-2 mb-2 w-2/3 h-1/2 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 rounded-xl'>
                        <div className='flex flex-col justify-evenly'>
                            <div>
                                <h3 className='ml-5 font-bold text-green-500'>Project Name:</h3>
                                <input type="text" className="input rounded-lg pl-1 w-2/3 ml-5 mt-1 border-2 border-green-500" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div>
                                <h3 className='ml-5 font-bold text-green-500'>Brief dexcription:</h3>
                                <textarea type="text" className="input rounded-lg pl-1 py-1.5 w-2/3 ml-5 mt-1 border-2 border-green-500" placeholder="" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                        </div>
                        <div className='flex flex-col justify-evenly'>
                            <div className='max-h-1/2'>
                                <h3 className='ml-2 font-bold text-green-500'>Choose contributors:</h3>
                                <div className='flex mr-3 scrollbar scrollbar-thumb-gray-600 scrollbar-thumb-rounded-xl max-h-28 flex-col overflow-y-scroll border-2 rounded-xl py-2 border-green-500'>
                                    {users.map((user, index) => (
                                        <div key={user.id} className='pl-5 grid grid-cols-3 mb-1 hover:bg-green-100 duration-300'>
                                            <p>{user.id}</p>
                                            <p>{user.name}</p>
                                            <button className='text-sm standardBtn' onClick={(e) => setContributors(contributors => [...contributors, user.id])}>Add</button>
                                        </div>
                                    ))}    
                                </div>
                            </div>
                            { contributorsNames.length > 0 &&
                                <div className='max-h-1/2'>
                                    <h3 className='ml-2 font-bold text-green-500'>Contributors List:</h3>
                                    <div className='flex mr-3 max-h-28 scrollbar scrollbar-thumb-gray-600 scrollbar-thumb-rounded-xl flex-col overflow-y-scroll border-2 rounded-xl py-2 border-green-500'>
                                    {contributorsNames.map((user, index) => (
                                        <div key={index} className='pl-5 grid grid-cols-2 mb-1 hover:bg-green-100 duration-300'>
                                            <p>{user}</p>
                                            <button className='text-sm standardBtn' onClick={(e) => setRemoved(contributorsNames.splice(index, 1))}>Remove</button>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            }
                        </div>    
                    </div>
                    { name === '' ?
                        <button className='ml-2 standardBtn hover:ring-0 bg-slate-300 hover:bg-slate-300 cursor-default'>Create Project</button>
                        : <button className='ml-2 standardBtn' onClick={addProj}>Create Project</button>
                    }
                    <p>{msg}</p>
                </div>
            }
        </div>
        
    )
}