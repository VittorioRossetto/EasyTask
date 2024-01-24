import { Sequelize } from "sequelize";
import db from "../config/Database.js";
 
const { DataTypes } = Sequelize;
 
/*
*   This will be the only commented model, to avoid repetitions 
*/

// We define the project entity structure
const Projects = db.define('projects',{

    name:{
        type: DataTypes.STRING
    },
    description:{
        type: DataTypes.TEXT('medium')
    },
    creation_date:{
        type: DataTypes.DATE
    },
    tasks: {
        type: DataTypes.JSON
    },
    creator: {
        type: DataTypes.INTEGER
    },
    contributors: {
        type: DataTypes.JSON
    }
    
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync(); // We synchronize the database
})();
 
export default Projects;