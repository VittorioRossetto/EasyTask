/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
/* import jwt_decode from "jwt-decode"; */
import { useParams } from 'react-router-dom';
import { getUserName, getUserPermit } from './Utilities';
import Moment from 'moment';
import DatePicker from 'react-date-picker';
import dateFormat from 'dateformat';
import jwt_decode from "jwt-decode";

export default function ProjectPage(props) {
    const [user, setUser] = useState(null);
    const [/* token */, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [project, setProject] = useState(null);
    const [contributors, setContributors] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [contributorsNames, setContributorsNames] = useState([])
    const [creator, setCreator] = useState('')
    const [taskName, setTaskName] = useState('');
    const [permit, setPermit] = useState(null)
    const [userId, setUserId] = useState(null)
    const [deadline, setDeadline] = useState(new Date());
    const [removing, setRemoving] = useState(false);
    const [removeCheck, setRemoveCheck] = useState('')
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const params = useParams();

    const axiosJWT = axios.create();
 
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setUser(decoded.id);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const refreshToken = async () => {
        try {
            const response = await axios.get('/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setUser(decoded.name);
            setExpire(decoded.exp);
            setUserId(decoded.userId)
        } catch (error) {
            if (error.response) {
                navigate("/");
            }
        }
    }

    // When the user is retrieved we also retrieve is permit
    useEffect(() => {
        if(user !== null)
            getUserPermit(userId).then((res) => setPermit(res))
    },[userId])

    // On page loading we call functions to retrieve every usefull information
    useEffect(() => {
        refreshToken()
        setContributorsNames([])    // Line usefull for developmemt to avoid accumulation in contributors
        getProject(params.project_id).then((res) => setProject(res))
        getTasks(params.project_id).then((res) => setTasks(res))
    },[])

    // The moment the project is loaded, we also set the contributors
    useEffect(() => {
        if(project !== null) {
            console.log(project)
            setContributors(JSON.parse(project.contributors))  
            getUserName(project.creator).then((res) => setCreator(res))  
        }
    },[project])

    // When contributors are loaded, we also set their names
    useEffect(() => {
        if(contributors.length > 0) {
            console.log(contributors)

            for (let i = 0; i < contributors.length; i++) {
                getUserName(contributors[i]).then((res) => setContributorsNames(contributorsNames => [...contributorsNames, res]))  
            }
        }
    }, [contributors])

    // When they're set we log contributors names
    useEffect(() => {
        if(contributorsNames.length > 0) {
            console.log(contributorsNames)
        }
    }, [contributorsNames]);

    // When they're set we log tasks
    useEffect(() => {
        if(tasks.length > 0) {
            console.log(tasks)
        }
    },[tasks])

    useEffect(() => {
        if(removing) {
            console.log('project removable')
        }
    }, [removing])

    // Log msg when is set
    useEffect(() => {
        if(msg !== '')
            console.log(msg)
    }, [msg])


    // Call server to rerieve project
    const getProject = async(projectId) => {
        const response = await axios.get('/project?project_id=' + projectId, {    
        })
        return response.data[0]
    }

    // Call server to rerieve tasks
    const getTasks = async(projectId) => {
        const response = await axios.get('/tasks?project_id=' + projectId,{
        })
        console.log(response)
        return response.data
    }

    // Function for task creation
    const addTask = async(e) => {
        e.preventDefault()
        // First we create an object with task datas
            const obj = {
                name: taskName,
                creation_date: Moment().format("DD-MM-YYYY"),
                creator: user,
                project_id: project.id,
                deadline: deadline,
                comments: []
            }
            try {
                // Then we call server to add the task in DB 
                const res = await axios.post('/tasks', obj)
                setMsg(res.data["msg"]) // We set msg to the application status
                getTasks(params.project_id).then((res) => setTasks(res)) // Refresh tasks
            } catch (e) {
                console.log(e)
            } 
    }

    // Function for project deletion 
    const deleteProject = async(e) => {
        e.preventDefault()
        // Only on second button press
        if(removing) {
            console.log('removable' + removing);
            // First we check the user has written the right name to make sure he actually wants to delete
            if(removeCheck === project.name) {
                const obj = {
                    id: project.id
                }
                try {
                    // We call server to remove current project from DB
                    await axios.post('/delete_proj', obj)
                    // Navigate to the main page
                    navigate('/')
                } catch (e) {
                    console.log(e)
                }
            }    
        }
        else {
            setRemoving(true)
        }
    }

    return (
        <div>
            { project &&
                <div className='grid grid-cols-2 pt-12'>
                    <div className='flex flex-col min-h-screen  gap-6 pl-5 text-white'>
                        <div className='flex flex-row justify-between'>
                            <h1 className='font-bold text-6xl'>{project.name}</h1>
                            <button className='standardBtn top-1/4 relative h-2/3 w-1/4' onClick={(e) => navigate('/')}>Project List</button>
                        </div>
                        <div className='font-bold text-2xl flex flex-row gap-8'>
                            <h3>Creator: {creator}</h3>
                            <h3>{dateFormat(project.creation_date, "mm/dd/yyyy")}</h3>
                        </div>
                        
                        { project.description !== '' &&
                            <div className='max-h-[50vh] px-4 py-2 scrollbar scrollbar-thumb-gray-900 scrollbar-thumb-rounded-xl bg-white bg-opacity-20 rounded-xl'>
                                <p className='text-xl '>{project?.description}</p>
                            </div>
                        }
                            
                        
                        
                        <div className='flex flex-col rounded-xl mb-2 bg-slate-50'>
                            <div className='mb-5'>
                                <h3 className='ml-5 font-bold text-green-500'>Task Name:</h3>
                                <input type="text" className="text-black input rounded-lg pl-1 w-2/3 ml-5 mt-1 border-2 border-green-500" placeholder="Name" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                            </div>
                            <div className='mb-5'>
                                <h3 className='ml-5 font-bold text-green-500'>Deadline:</h3>
                                <DatePicker dateFormat="yyyy/MM/dd" className='text-black ml-5' value={deadline} onChange={setDeadline} />
                            </div>
                            { taskName === '' ?
                                <button className='standardBtn ml-5 mb-2 bg-slate-300 hover:bg-slate-300 cursor-default'>Add Task</button>
                                : <button className='standardBtn ml-5 mb-2' onClick={addTask}>Add Task</button>
                            }

                            
                            { msg !== '' &&
                                <p className='text-black mb-2 ml-5'>{msg}</p>     
                            }
                        </div>

                        {permit === 1 &&
                            <div className='bg-slate-50 rounded-xl flex flex-col '>
                                <div className='flex flex-row justify-evenly mb-2  py-5'>
                                    <h1 className='ml-5 font-bold text-2xl text-green-500'>Delete Project:</h1>
                                    { !removing || (removeCheck === project.name && removeCheck !== '') ?
                                        <button className='standardBtn bg-red-600 hover:bg-red-500 w-1/4' onClick={deleteProject}>Delete</button>
                                        : <button className='standardBtn bg-slate-300 hover:bg-slate-300 cursor-default w-1/4'>Delete</button>
                                    }
                                </div>
                                
                                { removing &&
                                    <div className='flex flex-row justify-evenly py-5'>
                                        <p className='ml-5 font-bold text-green-500'>Confirm project name<br/>and press the button again to delete it:</p>
                                        <input type="text" className="text-black input rounded-lg pl-1 w-2/3 mt-1 border-2 mr-2 border-green-500" placeholder="Name" value={removeCheck} onChange={(e) => setRemoveCheck(e.target.value)} />
                                    { removeCheck !== project.name && removeCheck !== '' &&
                                        <p className='text-red-600'>Wrong Name</p>
                                    }
                                    </div>
                                    
                                }
                            </div> 
                        }   
                    </div>
                    <div>
                        <div className='flex flex-col left-1/3 relative w-1/3 h-[40vh] max-h-[40vh] bg-slate-50 rounded-xl'>
                            <div className='bg-green-500 rounded-t-xl h-10 text-center pb-1'>
                                <h3 className='text-white font-semibold text-xl top-[16.6%] relative'>Contributors</h3>
                            </div>
                            <div className='flex flex-col scrollbar scrollbar-thumb-gray-900 scrollbar-thumb-rounded-xl'>
                                {contributors.length > 0 ?
                                    (
                                        <div>
                                            {contributorsNames.map((user, index) => (
                                                <div key={index} className='grid grid-cols-2 hover:bg-green-100 duration-500'>
                                                    <p className='text-center'>{contributors[index]}</p>
                                                    <p>{user}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                    : (<h1>This project has no Contributors</h1>)
                                }   
                            </div>
                        </div>
                        <div className='m-6 bg-slate-100 rounded-xl h-[80vh]'>
                            <div className='bg-green-500 rounded-t-xl h-[8vh] text-center pb-1'>
                                <h3 className='text-white font-semibold text-xl top-[16.6%] relative'>Tasks</h3>
                            </div>
                            <div className='flex flex-col h-[72vh] scrollbar scrollbar-thumb-gray-900 scrollbar-thumb-rounded-xl'>
                                {tasks.length > 0 ?
                                    (
                                        <div>
                                            {tasks.map((task, index) => (
                                                <div key={index} className='grid grid-cols-5 text-center hover:bg-green-100 duration-500 py-3'>
                                                    <p>{task.name}</p>
                                                    <p>Created:<br />{dateFormat(task.creation_date, "mm/dd/yyyy")}</p>
                                                    <p>Deadline:<br />{dateFormat(task.deadline, "dd/mm/yyyy")}</p>
                                                    {task.completed ?
                                                        <p className='font-bold text-green-500'>Completed</p>
                                                        :<>
                                                            {Moment().isAfter(task.deadline) ?
                                                                <p className='font-bold text-red-500'>Late</p>
                                                                : <p className='font-bold text-orange-500'>Ongoing</p>
                                                            }
                                                        </>    
                                                    }
                                                    <button className='standardBtn h-7 text-sm' onClick={(e) => navigate('/task/' + task.id)}>Open</button>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                    : (<h1 className='text-xl ml-2'>This project has no tasks yet</h1>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}