const jwt = require("jsonwebtoken")
const AppError = require("../utils/AppError")

function authMiddleware(req, res, next){

    const authHeader = req.headers.authorization;

    // missing header
    if(!authHeader){
        throw new AppError("Authentication Required!", 401, "AUTHENTICATION_REQUIRED")
    }

    // EXTRACT TOKEN 
    const [ scheme, token ] = authHeader.split(" ");

    // invalid auth header
    if(scheme !== "Bearer" || !token){
        throw new AppError("Invalid authorization header", 401, "INVALID_AUTH_HEADER")
    }
    try {

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // attach authenticated user
        req.user = {
            id : decoded.userId
        };
        next();
    } catch (error) {
        throw new AppError("Invalid or expired token", 401, "INVALID_TOKEN")
    }
}



module.exports = authMiddleware