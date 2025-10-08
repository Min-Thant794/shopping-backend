const {createClient} = require('redis')
const config = require('./config')

let client;
const connectRedis = async () => {
    try {
        client = createClient({
        username: config.REDIS_USERNAME,
        password: config.REDIS_PASSWORD,
        socket: {
            host: config.REDIS_HOST,
            port: config.REDIS_PORT
        }
    });
    if(!client){
        console.log("Redis client failed to connect!")
    }

    await client.connect();
    client.on("error", () => console.log("Error connecting redis client"))
    client.on("success", () => "Redis successfully connected!")

    } catch (error) {
        console.log("An error ocurred!", error)
    }
}

const setCache = async (key, data) => {
    try {
        await client.set(key, JSON.stringify(data), "EX", config.REDIS_TTL) //key, value, auto expire, seconds
    } catch (error) {
        console.log("Redis set cache error!", error)
    }
}

const getCache = async (key) => {
    try {
        const cachedData = await client.get(key) //key from set
        return cachedData
    } catch (error) {
        console.log("Redis get cache error!", error)
    }
}

const clearCache = async(key) => {
    try {
        await client.del(key)
    } catch (error) {
        console.log("Clear Cache Error Occurred!", error)
    }
}

//client.on('error', err => console.log('Redis Client Error', err));

module.exports = {connectRedis, setCache, getCache, clearCache}