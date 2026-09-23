require('dotenv')
const express = require("express")

const app = express()

const PORT = process.env.PORT || 4000

// middleware
app.use(express.json())

// health check
app.get("/",(req, res)=>{
    res.send("Good Work!")
})

app.get("/health",(req, res) => {
    res.status(200).json({ message: "Okay!"})
})

app.listen(PORT, ()=> console.log(`Server Running at http://localhost:${PORT} `))