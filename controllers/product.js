const path = require('path');

const Product = require('../models/product');

const ITEMS_PER_PAGE = 6;

exports.getProducts = async (req, res, next) => {
    const page = +req.query.page || 1

    let totalItems

    try {
        const numPosters = await Product.find().countDocuments()
        totalItems = numPosters
        const products = await Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)

        res.render('product/product-list', {
            prods: products,
            pageTitle: 'Post',
            path: '/product',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        })
    } catch (err) {
        const error = new Error(err)
        err.httpStatusCode = 500
        next(error)
    }
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('product/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getIndex = async (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    try {
        const numPosts = await Product.find().countDocuments()

        totalItems = numPosts;

        const products = await Product
            .find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
        res.render('product/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        })
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        next(error);
    }

};


