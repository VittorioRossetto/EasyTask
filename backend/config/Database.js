import { Sequelize } from "sequelize";

// Sequelize object for access to database
const db = new Sequelize('auth_db', 'root', 'root', {
    host: 'localhost',
    port: 3307,
    dialect:'mysql'
})
 
export default db;