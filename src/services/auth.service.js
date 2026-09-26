const bcrypt = require("bcrypt")
const prisma = require("../lib/prisma.js");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken")


async function registerUser({name, email ,password}) {
    
    // check if mail exist
    const existingUser = await prisma.user.findUnique({
        where : {
            email
        }
    });

    if(existingUser){
        throw new AppError("Email Already Exists", 409, "EMAIL_ALREADY_EXISTS")
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

// login

async function loginUser({email, password}) {
    
    // find user
    const user = await prisma.user.findUnique({
        where :{
            email
        }
    });

    if(!user) {
        throw new AppError("Invalid Credentials!",401,"INVALID_CREDENTIALS")
    }

    // COMPARE PSWD
    const passwordMatches = await bcrypt.compare(password,user.password);

    // incorrect
    if(!passwordMatches){
        throw new AppError("Invalid Credentials",401,"INVALID_CREDENTIALS");
    }

    // generate jwt token
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES_IN || "1d"});

    return {
        token,
        user : {
            id: user.id,
            name: user.name,
            email: user.email
        }
    }
}

module.exports = {
    registerUser, loginUser
}