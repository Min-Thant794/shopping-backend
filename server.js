const express = require('express');
const app = express()
const mongoose = require("mongoose")
require('dotenv').config();
const config = require("./src/config/config")
const port = config.PORT
const mongodb_url = config.MONGODB_URL
const userRoutes = require("./src/routes/user.route")
const unitRoutes = require("./src/routes/unit.route")
const categoryRoutes = require("./src/routes/category.route")
const productRoutes = require("./src/routes/product.route")
const sizeMapRoutes = require("./src/routes/sizeMap.route")
const json = require('json')
const cors = require('cors');
const {connectRedis, setCache, getCache} = require("./src/config/redisClient")

app.use(cors('http://localhost:4000',
    'http://localhost:3000',
    'https://shopping-pwa-admin-ui.vercel.app/'
));
app.use(express.json())
app.listen(port, ()=>{
    console.log(`Server is listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
    res.send("Api start working!")
})

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/unit", unitRoutes)
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/product", productRoutes)
app.use("/api/v1/sizeMap", sizeMapRoutes)

mongoose.connect(mongodb_url).then(() =>{
    console.log("Mongodb is successfully connnected!")})
    connectRedis().then(() => {
        console.log("Redis successfully connected!")})
    .catch((error) => console.log("Fail to connect with database", error))