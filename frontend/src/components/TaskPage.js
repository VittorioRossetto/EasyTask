/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from "react"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getUserName } from "./Utilities";
import dateFormat from 'dateformat';
import Moment from "moment";
import jwt_decode from "jwt-decode";


export default function TaskPage() {
    const [user, setUser] = useState(null);
    const [/* token */, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([])
    const [msg, setMsg] = useState('')
    const [commentVal, setCommentVal] = useState('')
    const [commentCreators, setCommentCreators] = useState([])
    const params = useParams()
    const navigate = useNavigate()

    // On page load we retrieve the current task and then we retrieve comments
    useEffect(() => {
        setCommentCreators([])
        refreshToken()
        getTask(params.task_id).then((res) => setTask(res))
        getComments(params.task_id).then((res) => setComments(res))
    },[])

    //When the comments are set we also retrieve the comment creators
    useEffect(() => {
        if(comments.length > 0) {
            console.log(comments)
            try {
                comments.forEach(comment => {
                    getUserName(comment.creator).then((res) => setCommentCreators(commentCreators => [...commentCreators, res]))
                });
                

            } catch (error) {
                console.log(error)
            }
        }
    },[comments])

    /* Logs for every data */

    useEffect(() => {
        if(commentCreators.length > 0)
            console.log(commentCreators)
    }, [commentCreators])

    useEffect(() => {
        if(task !== null)
            console.log(task)
    },[task])

    useEffect(() => {
        if(comments.length > 0)
            console.log(comments)
    },[comments])

    // Function that calls server to retrieve the current task
    const getTask = async(taskId) => {
        const response = await axios.get('/task?task_id=' + taskId, {    
        })
        return response.data[0]
    }

    // Function that calls server to retrieve the current task's comments
    const getComments = async(taskId) => {
        const response = await axios.get('/comments?task_id=' + taskId, {    
        })
        return response.data
    }

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
            setUser(decoded.userId);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                navigate("/");
            }
        }
    }

    // Function to change the current task state
    const setCompletion = async(e) => {
        e.preventDefault()
        try {
            const res = await axios.get('/update_task_compl?task_id=' + task.id,{
            })
            setMsg(res.data["msg"])
            getTask(params.task_id).then((res) => setTask(res))
        } catch(e) {
            console.log(e)
        }
    }

    // Function for comment creation
    const addComment = async(e) => {
        e.preventDefault()
            const obj = {
                value: commentVal,
                creation_date: Moment(),
                creator: user, 
                project_id: task.project_id,
                task_id: task.id,
            }

            try {
                await axios.post('/comments', obj)
                getComments(params.task_id).then((res) => setComments(res))
                setCommentVal('')
            } catch(error) {
                console.log(error)
            }
    }    

    return (
        <div className="flex flex-col w-screen">
            { task &&
                <div>
                    <div className="text-white mt-10 ml-5">
                        <div className="flex gap-[10vw] flex-row">
                            <h1 className="text-5xl font-bold">{task?.name}</h1>
                            <button className="standardBtn my-1 w-1/4" onClick={(e) => navigate('/project/' + task.project_id)}>Project</button>
                        </div>
                        <h3 className="text-2xl mt-5">Created from: {task?.creator} on {dateFormat(task.creation_date, "mm/dd/yyyy")}</h3>
                        <h3 className="text-2xl">Deadline: {dateFormat(task.deadline, "dd/mm/yyyy")}</h3>
                        <div className="rounded-xl py-2 text-2xl bg-slate-50 w-2/3 mt-5 flex flex-row justify-evenly text-green-600">
                            <h3 className="">Status:</h3>
                            {task.completed ?
                                <p className='font-bold text-green-500'>Completed</p>
                                :<>
                                    {Moment().isAfter(task.deadline) ?
                                        <p className='font-bold text-red-500'>Late</p>
                                        : <p className='font-bold text-orange-500'>Ongoing</p>
                                    }
                                </>    
                            }
                            <h3>Mark as completed:</h3>
                            {!task.completed ?
                                <button className="standardBtn w-1/5" onClick={setCompletion}>Complete</button>
                                : <button className="standardBtn w-1/5 bg-slate-300 hover:bg-slate-300 cursor-default" >Complete</button>
                            }
                            
                        </div>
                        { msg !== '' &&
                            <p>{msg}</p>
                        }
                    </div>
                    <div className="rounded-xl mt-10 bg-slate-100 ml-5 p-5 pt-2 w-11/12">
                        <h3 className="text-green-600 font-bold text-2xl">Comments:</h3>
                        <div className="flex flex-row justify-between mt-2">
                            <textarea className="border-2 w-3/4 rounded-xl border-green-600 p-1 pl-2" placeholder="Write your comment here" value={commentVal} onChange={(e) => setCommentVal(e.target.value)}></textarea>
                            { commentVal === '' ? 
                                <button className="standardBtn w-1/6 bg-slate-300 hover:bg-slate-300 cursor-default" >Add Comment</button>
                                : <button className="standardBtn w-1/6" onClick={addComment}>Add Comment</button>
                            }    
                        </div>
                        <div className="mt-2 max-h-[40vh] scrollbar scrollbar-thumb-gray-900 scrollbar-thumb-rounded-xl">
                            {comments.map((comment, index) => (
                                <div key={index} className="flex flex-row justify-between min-h-[10vh] p-2 hover:bg-slate-200 duration-500">
                                    <p className="font-bold text-green-600">{commentCreators[index]}</p>
                                    <div className="w-2/3 flex-flex-wrap break-words">
                                        {comment.value}
                                    </div>
                                    <p className="text-slate-500">{dateFormat(comment.creation_date, "mm/dd/yyyy, h:MM TT")}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}