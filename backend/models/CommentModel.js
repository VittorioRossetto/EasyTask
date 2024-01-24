import { Sequelize } from "sequelize";
import db from "../config/Database.js";
 
const { DataTypes } = Sequelize;
 
const Comments = db.define('comments',{
    value:{
        type: DataTypes.TEXT('medium')
    },
    creation_date:{
        type: DataTypes.DATE
    },
    creator: {
        type: DataTypes.STRING
    },
    project_id: {
        type: DataTypes.STRING
    },
    task_id: {
        type: DataTypes.STRING
    },
    
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
 
export default Comments;