import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css'
import axios from "axios";
 
axios.defaults.withCredentials = true;
 
const root = ReactDOM.createRoot(document.getElementById("root"));
    // Removing React.strictmode tags to avoid double calls
root.render(
    <App />
);