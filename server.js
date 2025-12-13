require('dotenv').config();
const express = require('express');
const http = require("http");
const mongoose = require("mongoose");
const cors = require('cors');

const config = require("./src/config/config");
const {connectRedis} = require("./src/config/redisClient");
const { initSocket } = require("./src/utils/socket");

const userRoute = require("./src/routes/user.route");
const roleRoute = require("./src/routes/role.route");
const unitRoute = require("./src/routes/unit.route");
const sizeRoute = require("./src/routes/size.route");
const categoryRoute = require("./src/routes/category.route");
const productRoute = require("./src/routes/product.route");
const orderRoute = require('./src/routes/order.route');
const paymentRoute = require('./src/routes/payment.route');
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:4000",
        "https://shopping-pwa-admin-ui.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

//Test route
app.get("/", (req, res) => {
    res.send("API is running with Socket.IO!");
});

app.listen(config.PORT, ()=>{
    console.log(`Server is listening at http://localhost:${config.PORT}`)
})

app.get('/', (req, res) => {
    res.send("Api start working!")
})

app.use("/api/v1/user", userRoute);
app.use("/api/v1/unit", unitRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/size", sizeRoute);
app.use("/api/v1/role", roleRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);

//Initialize Socket.IO
initSocket(server);

mongoose.connect(config.MONGODB_URL).then(() =>{
    console.log("Mongodb is successfully connnected!")})
    
connectRedis().then(() => {
    console.log("Redis successfully connected!")})
    .catch((error) => console.log("Fail to connect with database", error))