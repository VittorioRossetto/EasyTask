import express from "express";
import { getUsers, Register, Login, Logout, getUser } from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { addProject, getProjects, getProject, deleteProject, updateProjTasks } from "../controllers/Projects.js";
import { addTask, getTask, getTasks, updateCompletion } from "../controllers/Tasks.js";
import { addComment, getComments } from "../controllers/Comments.js";
 
const router = express.Router();
 
// Here we define every server endpoint for the client to call
router.get('/users', verifyToken, getUsers);
router.get('/user', getUser)
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.get('/projects', getProjects)
router.post('/projects', addProject)
router.post('/delete_proj', deleteProject)
router.post('/update_proj_tasks', updateProjTasks)
router.get('/project', getProject)
router.get('/tasks', getTasks)
router.post('/tasks', addTask)
router.get('/task', getTask)
router.get('/update_task_compl', updateCompletion)
router.get('/comments', getComments)
router.post('/comments', addComment)
 
export default router