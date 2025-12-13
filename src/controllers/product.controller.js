const productModel = require("../models/product.model");
const Size = require("../models/size.model");

const { uploadImages } = require("../config/supabase");
const { setCache } = require("../config/redisClient");

const getAllProduct = async (req, res) => {
    try {
        let { page = 1, limit = 12, category, discount } = req.query;
        
        page = parseInt(page);
        limit = parseInt(limit);

        const filter = {};

        //Filter by category (existing feature)
        if (category) {
            filter.category = category;
        }

        //Filter by discount items only (new feature)
        // If discount = true -> return items with discount > 0
        if (discount === "true") {
            return filter.discount = { $gt: 0};
        }

        //Total count for pagination
        const totalProducts = await productModel.countDocuments(filter);

        //Paginated fetch
        const products = await productModel.find(filter)
        .skip((page - 1) * limit)
        .limit(limit);

        return res.statu(200).json({
            success: true,
            message: `${products.length} product(s) retrieved`,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            limit,
            data: products
        })

    } catch (error) {
        console.log("An Error Occurred At getAllProduct()!", error);
        res.status(500).json({message: "Internal Server Error!", success: false });
    }
}

const getProductsByShopId = async (req, res) => {
    try {
        let { page = 1, limit = 12, category, discount } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const filter = {};

        // user/shop scope
        filter.shopId = req.id; //or filter.shopId = id; (depending on your schema)

        //filter by category
        if (category) {
            filter.category = category;
        }

        // filter for discount items
        if (discount === "true") {
            filter.discount = { $gt: 0};
        }

        // get total count
        const totalProducts = await productModel.countDocuments(filter);

        // Fetched paginated data
        const products = await productModel.find(filter)
        .skip((page -1) * limit)
        .limit(limit)
        .sort({createdAt: -1});

        // setCache(`product-${page}-${limit}`)
        return res.status(200).json({
            success: true,
            message: `${products.length} product(s) retrieved`,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            limit,
            data: products
        })
    } catch (error) {
        console.log("An Error Occurred At getProductsByShopId()", error);
        return res.status(500).json({ messgae: "Internal Server Error", success: false });
    }
}

const getProductByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const foundProducts = await productModel.find({ category });
        console.log("Found product by category: ", foundProducts);
        const totalProduct = foundProducts.length;
        if (foundProducts) {
            return res.status(200).json({ messgae: `${totalProduct} ${totalProduct > 1 ? " products" : " product"} retrieved!`, foundProducts, success: true });
        } else {
            return res.status(400).json({ message: "Product not found!", success: false });
        }
    } catch (error) {
        console.log("An Error Occurred At getProductByCategory()", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

const getProductByDiscountPercent = async (req, res) => {
    try {
        const { discount } = req.params;
        console.log("Type of params: ", typeof parseInt(discount));
        
        const foundProducts = await productModel.find({ discount: parseInt(discount)});
        console.log("Found products by discount: ", foundProducts);
        
        const totalProduct = foundProducts.length;
        if (foundProducts) {
            return res.status(200).json({ message: `${totalProduct} ${totalProduct > 1 ? " products" : " product"} retrieved!`, foundProducts, success: true });
        } else {
            return res.status(400).json({ message: "Product not found!", success: false });
        }
    } catch (error) {
        console.log("An Error Occurred At getProductByDiscount!", error);
        res.status(500).json({message: "Internal Server Error!", success: false });
    }
}

const createProduct = async (req, res) => {
    try {
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = await uploadImages(req.files);
        }

        console.log("req id", req.id);
        const productData = {
            ...req.body,
            shopId: req.id,
            imageUrls,
            //Ensure JSOn arrays are pared as objects
            size: typeof req.body.size === "string" ? JSON.parse(req.body.size) : req.body.size || [],
            variants: typeof req.body.variants === "string" ? JSON.parse(req.body.variants) : req.body.variants || [],
            discount: Number(req.body.discount) || 0
        };

        const createdProduct = await productModel.create(productData);

        if (createdProduct) {
            return res.status(200).json({ message: "Product created successfully!", data: createdProduct, success: true });
        } else {
            return res.status(400).json({ message: "Failed to create product!", success: false });
        }
    } catch (error) {
        console.log("An Error Occurred!", error)
        res.status(500).json({message: "Internal Server Error!", error})
    }
}

const batchCreateProduct = async (req, res) => {
    try {
        const batchCreatedProduct = await productModel.insertMany(req.body);
        if (!batchCreatedProduct) res.status(400).json({message: "Failed to create batch products!"})
            res.status(200).json({message: "Product successfully batch created!", batchCreatedProduct})
    } catch (error) {
        console.log("An Error Occurred!", error)
        res.status(500).json({message: "Internal Server Error!", error})
    }
}

const updateProduct = async (req, res) => {
    try {
        let imageUrls = req.body.imageUrls || [];
        if (req.files && req.files.length > 0) {
            const uploaded = await uploadImages(req.files);
            imageUrls = [...imageUrls, ...uploaded];
        }

        const updatedData = {
            ...req.body,
            imageUrls,
            size: typeof req.body.size === "string"? JSON.parse(req.body.size) : req.body.size || [],
            variants: typeof req.body.variants === "string" ? JSON.parse(req.body.variants) : req.body.variants || [],
            discount: Number(req.body.discount) || 0
        }

        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (updatedProduct) {
            return res.status(200).json({ message: "Product updated successfully", data: updatedProduct, success: true });
        } else {
            return res.status(400).json({ message: "Failed to update product!", success: false });
        }
    } catch (error) {
        console.log("An Error Occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const getProductWithDiscount = async (req, res) => {
    try {
        const foundProducts = await productModel.find({ discount: { $gt: 0}});
        console.log("Found product by discount: ", foundProducts);

        const totalProduct = foundProducts.length;
        if (foundProducts) {
            return res.status(200).json({ message: `${totalProduct} ${totalProduct > 1 ? " products" : " product"} retrieved!`, foundProducts, success: true });
        } else {
            return res.status(400).json({ message: "Product not found!", success: false });
        }
    } catch (error) {
        console.log("An Error Occurred At getProductWithDiscount()", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await productModel.findByIdAndDelete(id, { new: true });
        if (!deletedProduct) {
            return res.status(400).json({ message: "Failed to delete product!", success: false });
        } else {
            console.log("Product is successfully deleted");
            return res.status(200).json({ message: "Product is successfully deleted!", data: deletedProduct, success: true });
        }
    } catch (error) {
        console.log("An Error Occurred At deleteProduct()", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

module.exports = {
    getAllProduct,
    getProductByCategory,
    getProductByDiscountPercent,
    getProductWithDiscount,
    createProduct,
    getProductsByShopId,
    batchCreateProduct,
    updateProduct,
    deleteProduct
}