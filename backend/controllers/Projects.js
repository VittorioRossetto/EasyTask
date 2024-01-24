import { Op } from "sequelize";
import Projects from "../models/ProjectModel.js"

/*
*   This will be the only controller in which we comment simple CRUD operations to avoid repetitions
*/

// Function for retrieving every project where current user id is either creator or one of the components
export const getProjects = async(req, res) => {
    try {
        const projects = await Projects.findAll({
            attributes:['id', 'name', 'description', 'creation_date', 'creator', 'tasks', 'contributors'],
            raw: true
        });
        const avail = [];
        projects.forEach(project => {
            if(project.creator == req.query.user_id) // First we chck if the user is cretor
                avail.push(project) // If so, we push the project inside the array that will be used as response
            else {
                const contributors = JSON.parse(project.contributors) // We parse the project contributors
                contributors.forEach(contributor => { 
                    if(contributor == req.query.user_id) // We check if user is one of the contributors
                        avail.push(project) // If so, we push
                });
            }
        });
        res.json(avail);
    } catch(error) {
        console.log(error)
    }
}

// Function to retrieve one project from its id
export const getProject = async(req, res) => {
    try {
        const projects = await Projects.findAll({
            where: {
                id: req.query.project_id
            },
            attributes:['id', 'name', 'description', 'creation_date', 'creator', 'tasks', 'contributors']
        }); // Equivalent to SELECT * FROM Projects WHERE id = project_id
        res.json(projects);
    } catch (error) {
        console.log(error);
    }
}

// Function to CREATE a new project, given the equivalent object
export const addProject = async(req, res) => {
    const { name, description, creation_date, creator, tasks, contributors} = req.body;
    try {
        await Projects.create({
            name: name,
            description: description,
            creation_date: creation_date,
            creator: creator,
            tasks: tasks,
            contributors: contributors
        })
        res.json({msg: "Project added succesfully!"}); // We send a message to communicate operation status to client
    } catch(error) {
        console.log(error);
    }
}

// Funtion to DELETE a prject, given its id
export const deleteProject = async(req, res) => {
    const {id} = req.body;
    try {
        await Projects.destroy({
            where: {id: id}
        })
        res.json({msg: "Project deleted succesfully!"}); 
    } catch (error) {
        console.log(error)
    }
}

// Function to UPDATE a project by adding a new task, given project id and task
export const updateProjTasks = async(req, res) => {
    const {id, tasks} = req.body;
    try {
        await Projects.update({tasks: tasks,
            where: {id: id}
        })
        res.json({msg: "Project updated succesfully!"});
    } catch (error) {
        console.log(error)
    }
}