require('dotenv')
const express = require("express")
const authRoutes = require("./routes/auth.routes.js")
const errorHandler = require('./middleware/error.middleware.js')
const app = express()

const PORT = process.env.PORT || 4000

// middleware
app.use(express.json())

app.use("/auth", authRoutes)

// health check
app.get("/",(req, res)=>{
    res.send("Good Work!")
})

app.get("/health",(req, res) => {
    res.status(200).json({ message: "Okay!"})
})


app.use(errorHandler)
app.listen(PORT, ()=> console.log(`Server Running at http://localhost:${PORT} `))