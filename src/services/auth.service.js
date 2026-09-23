const bcrypt = require("bcrypt")
const prisma = require("../lib/prisma.js");
const AppError = require("../utils/AppError");

async function registerUser({name, email ,password}) {
    
    // check if mail exist
    const existingUser = await prisma.user.findUnique({
        where : {
            email
        }
    });

    if(existingUser){
        throw new AppError("Email Already Exists", 409, "EMAIL_ALREADY_EXISTS!")
    }

    // hash pswd
    const hashedPassword = await bcrypt.hash(password, 12);

    // create user
    const user = await prisma.user.create({
        data : {
            name,
            email,
            password : hashedPassword
        }
    });

    // no pswd return
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
    };
}

module.exports = {
    registerUser
}