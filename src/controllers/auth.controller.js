const { registerUser } = require("../services/auth.service");

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
module.exports = { register }