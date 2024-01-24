import Comments from "../models/CommentModel.js"

export const getComments = async(req, res) => {
    try {
        const comments = await Comments.findAll({
            where: {
                task_id: req.query.task_id
            },
            attributes:['id', 'value', 'creation_date', 'creator', 'task_id', 'project_id']
        });
        res.json(comments);
    } catch(error) {
        console.log(error)
    }
}

export const addComment = async(req, res) => {
    const { value, creation_date, task_id, creator, project_id} = req.body;
    try {
        await Comments.create({
            value: value,
            creation_date: creation_date,
            task_id: task_id,
            creator: creator,
            project_id: project_id
        })
        res.json({msg: "Comment added succesfully!"});
    } catch(error) {
        console.log(error);
    }
}