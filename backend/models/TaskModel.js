import { Sequelize } from "sequelize";
import db from "../config/Database.js";
 
const { DataTypes } = Sequelize;
 
const Tasks = db.define('tasks',{
    name:{
        type: DataTypes.STRING
    },
    creation_date:{
        type: DataTypes.DATE
    },
    deadline: {
        type: DataTypes.DATE
    },
    creator: {
        type: DataTypes.STRING
    },
    project_id: {
        type: DataTypes.INTEGER
    },
    completed: {
        type: DataTypes.BOOLEAN
    },
    comments: {
        type: DataTypes.JSON
    }
    
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
 
export default Tasks;