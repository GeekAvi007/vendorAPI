require('dotenv')
const express = require("express")
const authRoutes = require("./routes/auth.routes.js")
const errorHandler = require('./middleware/error.middleware.js')
const app = express()
const vendorRoutes = require("./routes/vendor.routes.js")
const PORT = process.env.PORT || 4000

// middleware
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/vendors",vendorRoutes)

// health check
app.get("/",(req, res)=>{
    res.send("Good Work!")
})



app.use(errorHandler)
app.listen(PORT, ()=> console.log(`Server Running at http://localhost:${PORT} `))