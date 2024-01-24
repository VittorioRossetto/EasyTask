import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
 
export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['id','name','email']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const getUser = async(req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                id: req.query.user_id
            },
            attributes:['id','name','email', 'permit']
        });
        res.json(user);
    } catch (error) {
        console.log(error);
    }
}
 
// Function for user registration
export const Register = async(req, res) => {
    const { name, email, password, confPassword } = req.body;
    // First we check if password and password confirmation match, or we send status 400
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"}); 
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt); // We hash the password to avoid making it readable externally
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            permit: 0   // Permit is automatically set to simple user, it could later be changed by a db administrator
        });
        res.json({msg: "Registration Successful"});
    } catch (error) {
        console.log(error);
    }
}
 
// Login function
export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // Un giorno
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({msg:"Email not found"});
    }
}

// Logout function
export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);  // First we check if token is not null
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204); // If we can't find any user with the right token, we send 204
    const userId = user[0].id;
    await Users.update({refresh_token: null},{ // We unset the refresh token from the user 
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken'); // We clear the current token from the users
    return res.sendStatus(200);
}