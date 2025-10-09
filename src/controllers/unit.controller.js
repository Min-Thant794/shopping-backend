const unitModel = require("../models/unit.model")
const { setCache, getCache, clearCache } = require("../config/redisClient")
const config = require("../config/config")

const getAllUnit = async (req, res) => {
    try {
        //clearCache(config.REDIS_UNIT_KEY)
        const cachedData = await getCache(config.REDIS_UNIT_KEY)
        if(cachedData){
            const jsonData = JSON.parse(cachedData)
            res.status(200).json({
                success: true,
                message: "Data Fetched From Redis Cache",
                data: jsonData})
        }
        const allUnits = await unitModel.find({})
        //await clearCache(config.REDIS_UNIT_KEY)
        await setCache(config.REDIS_UNIT_KEY, allUnits)
        const totalUnits = allUnits.length;
        res.status(200).json({message: "Data Fetch From Mongo", allUnits })
    } catch (error) {
        console.log("Error Fetching unit!", error)
        res.status(500).json({message: "Failed to fetch unit!"})
    }
}

const createUnit = async (req, res) => {
    try {
        const createUnit = await unitModel.create({name: req.body.name.toUpperCase()})
        if (!createUnit) return res.status(405).json({message: "Failed to create unit!", success: false})
            await clearCache(config.REDIS_UNIT_KEY)
            res.status(200).json({data: createUnit, message: "Successfully unit created!", success: true})
    } catch (error) {
        console.log("An error occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const updateUnit = async(req, res) => {
    try {
        const updatedUnit = await unitModel.findByIdAndUpdate(req.params.id, {name: req.body.name.toUpperCase()}, {new:true})
        if(!updatedUnit) res.status(400).json("Failed to update unit!")
        
        await clearCache(config.REDIS_UNIT_KEY)
        res.status(200).json({message: "Successfully updated!", updatedUnit, success: true})
        console.log("Updated Unit: ", updatedUnit)
    } catch (error) {
        console.log("An error occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const deleteUnit = async(req, res) => {
    try {
        const deletedUnit = await unitModel.findByIdAndDelete(req.params.id)
        if(!deletedUnit) res.status(400).json("Failed to delete unit!")
        
        await clearCache(config.REDIS_UNIT_KEY)
        res.status(200).json({message: "Successfully deleted!", deletedUnit, success: true})
        console.log("Deleted Unit: ", deletedUnit)
    } catch (error) {
        console.log("An error occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

module.exports = {
    getAllUnit,
    createUnit,
    updateUnit,
    deleteUnit
}