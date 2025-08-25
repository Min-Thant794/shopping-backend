const express = require('express');
const app = express()
require('dotenv').config();
const port = process.env.PORT || 8080
const mongoose = require("mongoose")
const mongodb_url = process.env.MONGODB_URL
const userRoutes = require("./src/routes/user.route")
const json = require('json')
const cors = require('cors');
//app.use(cors("*"));

app.use(express.json())
app.listen(port, ()=>{
    console.log(`Server is listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
    res.send("Api start working!")
})

app.use("/api/v1", userRoutes)

mongoose.connect(mongodb_url).then(() => console.log("Mongodb is successfully connnected!")).catch((error) => console.log("Fail to connect with database", error))