import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import useToken from './components/useToken'
import ProjectsTable from "./components/ProjectTable";
import ProjectPage from './components/ProjectPage';
import TaskPage from './components/TaskPage';
 
function App() {
  const { token, removeToken, setToken } = useToken();

  return (
    <BrowserRouter>
      {/* Making Navbar always visible */}
      <Navbar className='' rmToken={removeToken} token={token}/>
      
      <div className='min-h-screen pt-5 w-screen bg-gradient-to-br from-slate-500 via-slate-700 to-slate-500'>
        
        {/* To navigate between Login/Register pages and actual application pages
         we check for the presence of a working token, so that the application automatically navigates to
         login page on token expiration or logout */}
        {!token && token!=="" && token !== undefined?
        (
          <Routes>
            <Route path="/" element={<Login setToken={setToken}/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
          </Routes>
        )
        :(
          <Routes>
            <Route path="/dashboard" element={<Dashboard/>}></Route>
            <Route path="/" element={<ProjectsTable token={token}/>}></Route>
            <Route path="/project/:project_id" element={<ProjectPage/>}></Route>
            <Route path="/task/:task_id" element={<TaskPage/>}></Route>
          </Routes>
        )}
      </div>
      
    </BrowserRouter>
  );
}
 
export default App;
