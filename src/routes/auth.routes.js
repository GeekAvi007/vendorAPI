const express = require("express")

const { register } = require("../controllers/auth.controller.js")

const authRouter = express.Router()

authRouter.post("/register", register);

module.exports = authRouter