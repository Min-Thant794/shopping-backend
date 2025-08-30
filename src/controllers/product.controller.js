const productModel = require("../models/product.model")

const getAllProduct = async (req, res) => {
    try {
        const allProduct = await productModel.find({})
        const totalProducts = allProduct.length
        res.status(200).json({message:`Total ${totalProducts} ${totalProducts > 1 ? 'products' : 'product'} in your store!`, allProduct})
    } catch (error) {
        console.log("An Error Occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const getProductByCategory = async (req, res) => {
    try {
        const { category } = req.params
        const foundProduct = await productModel.find({ category })
        const totalFoundProductByCat = foundProduct.length;
        res.status(200).json({message: `${totalFoundProductByCat} ${totalFoundProductByCat > 1 ? 'products' : 'product'} found with category!`, foundProduct})
    } catch (error) {
        console.log("An Error Occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const getProductByDiscount = async (req, res) => {
    try {
        const { discount } = req.params;
        const foundProductWithDiscount = await productModel.find({ discount })
        const totalFoundProductWithDiscount = foundProductWithDiscount.length;
        res.status(200).json({message: `${totalFoundProductWithDiscount} ${totalFoundProductWithDiscount > 1 ? 'products': 'product'} found with discount`, foundProductWithDiscount})
    } catch (error) {
        console.log("An Error Occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const createProduct = async (req, res) => {
    try {
        const createdProduct = await productModel.create(req.body)
        if(!createdProduct) res.status(400).json({message: "Failed to create product!"})
            res.status(200).json({message: "Product successfully created!", createdProduct})
    } catch (error) {
        console.log("An Error Occurred!", error)
        res.status(500).json({message: "Internal Server Error!", error})
    }
}

const batchCreateProduct = async (req, res) => {
    try {
        //to uppercase()
        //insertMany() create object(s)
        const productData = req.body.map(product => ({
            ...product,
            name: product.name ? product.name.toUpperCase() : undefined
        }))
        const batchCreatedProduct = await productModel.insertMany(productData)
        if (!batchCreatedProduct) res.status(400).json({message: "Failed to create batch products!"})
            res.status(200).json({message: "Product successfully batch created!", batchCreatedProduct})
    } catch (error) {
        console.log("An Error Occurred!", error)
        res.status(500).json({message: "Internal Server Error!", error})
    }
}

const updateProduct = async (req, res) => {
    try {
        const {name, description, category, size, variants, price, unit, discount, stock, rating, review} = req.body
        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, { name: name.toUpperCase(), description, category, size, variants, price, unit, discount, stock, rating, review }, {new: true})
        if (!updatedProduct) res.status(400).json({message: "Failed to update category!"})
            res.status(200).json({messgae: "Successfully updated!", updatedProduct})
    } catch (error) {
        console.log("An Error Occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const updateProductByName = async (req, res) => {
    try {
        const {name, description, category, price, unit, discount, stock, rating, review} = req.body
        const updatedProductByName = await productModel.findOneAndUpdate({name: req.params.name}, { name: name.toUpperCase(), description, category, size, variants, price, unit, discount, stock, rating, review }, {new: true})
        if (!updatedProductByName) res.status(400).json({message: "Failed to update category!"})
            res.status(200).json({message: "Successfully updated!", updatedProductByName})
    } catch (error) {
        console.log("An Error Occurred!")
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await productModel.findByIdAndDelete(req.params.id, {new: true})
        if (!deletedProduct) res.status(400).json({message: "Failed to delete product!"})
            res.status(200).json({message: "Successfully deleted!"})
    } catch (error) {
        console.log("An Error Occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const deleteProductByName = async (req, res) => {
    try {
        const deletedProductByName = await productModel.findOneAndDelete({name: req.params.name}, {new: true})
        if (!deletedProductByName) res.status(400).json({message: "Failed to delete product!"})
            res.status(200).json({message: "Successfully deleted!"})
    } catch (error) {
        console.log("An Error Occurred!")
        res.status(500).json({message: "Internal Server Error!"})
    }
}


module.exports = {
    getAllProduct,
    getProductByCategory,
    getProductByDiscount,
    createProduct,
    batchCreateProduct,
    updateProduct,
    updateProductByName,
    deleteProduct,
    deleteProductByName
}