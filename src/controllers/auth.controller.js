const { registerUser, loginUser } = require("../services/auth.service");
const AppError = require("../utils/AppError");

async function register(req, res, next) {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                error: "Credentials Required!"
            })
        }

        const user = await registerUser({
            name,email,password
        });

        return res.status(200).json({
            message: "User Registered!",
            user
        });

    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            throw new AppError("Email and Password are required", 400, "VALIDATION_ERROR")
        }

        const result = await loginUser({
            email,password
        })

        return res.status(200).json({
            message: "User Logged in",
            ...result})
    } catch (error) {
        next(error)
    }
}
module.exports = { register, login }