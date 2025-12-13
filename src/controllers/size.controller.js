const Size = require("../models/size.model");

const createSize = async (req, res) => {
    try {
        const createdSize = await Size.create(req.body);
        if (createdSize) {
            return res.status(200).json({ message: "Size is successfully created!", createdSize, success: true});
        } else {
            return res.status(500).json({ message: "Failed to create size!", success: false });
        }
    } catch (error) {
        console.log("Error creating size", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

module.exports = {
    createSize
}