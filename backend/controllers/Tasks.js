import Tasks from "../models/TaskModel.js"

export const getTasks = async(req, res) => {
    try {
        const tasks = await Tasks.findAll({
            where: {
                project_id: req.query.project_id
            },
            attributes:['id', 'name', 'creation_date', 'deadline', 'creator', 'comments', 'completed', 'project_id']
        });
        res.json(tasks);
    } catch(error) {
        console.log(error)
    }
}

export const getTask = async(req, res) => {
    try {
        const task = await Tasks.findAll({
            where: {
                id: req.query.task_id
            },
            attributes:['id', 'name', 'creation_date', 'deadline', 'creator', 'comments', 'completed', 'project_id']
        })
        res.json(task);
    } catch(error) {
        console.log(error)
    }
}

export const updateCompletion = async(req, res) => {
    const values = {completed: true}
    const selector = {where: {id: req.query.task_id}}
    try {
        await Tasks.update({completed: true}, 
            {
                where: {id: req.query.task_id}
            })
        res.json({msg: "Task updated succesfully!"})
    } catch(error) {
        console.log(error)
    }

    
}

export const addTask = async(req, res) => {
    const { name, creation_date, deadline, creator, comments, project_id} = req.body;
    try {
        await Tasks.create({
            name: name,
            creation_date: creation_date,
            deadline: deadline,
            creator: creator,
            comments: comments,
            project_id: project_id,
            completed: false
        })
        res.json({msg: "Task added succesfully!"});
    } catch(error) {
        console.log(error);
    }
}