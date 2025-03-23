const { Product } = require("../db/db");

module.exports.createProduct = async (req,res)=>{
    try{
        const {itemName,itemDescription,price,productType,stock,category,hashtags,image,creatorId} = req.body;

        if(!itemName || !itemDescription || !price || !productType || !stock || !category){
            throw new Error("Please fill all the details")
        }
        else{
            // const imageUrls = req.files.map(file => file.publicUrl); 
            const newProduct = await Product.create({
                itemName,
                itemDescription,
                price,
                productType,
                stock,
                category,
                hashtags,
                image,
                creatorId
            })

            res.status(200).json({
                message: "Product added successfully",
                newProduct
            })
        }

    }
    catch(err){
        res.status(400).json({
            message: err.message   
        })
    }
}      

module.exports.getProducts = async (req,res)=>{
        try {
            const products = await Product.find({});
            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: error.message });
        }
    
}

module.exports.getSingleProduct = async (req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports.updateProduct = async (req,res)=>{
    try {
        const { itemName, itemDescription, price, productType, hashtags, stock, category, image } = req.body;
        const updates = {};

        // Populate updates only with the provided fields in the request body
        if (itemName !== undefined) updates.itemName = itemName;
        if (itemDescription !== undefined) updates.itemDescription = itemDescription;
        if (price !== undefined) updates.price = price;
        if (productType !== undefined) updates.productType = productType;
        if (Array.isArray(hashtags)) updates.hashtags = hashtags;
        if (stock !== undefined) updates.stock = stock;
        if (category !== undefined) updates.category = category;
        if (image !== undefined) updates.image = image;

        // Check if any updates are provided
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No fields provided for update' });
        }

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: error.message });
    }
}
module.exports.deleteProduct = async (req, res) =>{
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports.addProduct = async (req,res)=>{
    
}
