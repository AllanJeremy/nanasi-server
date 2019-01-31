module.exports.sizeLimits = {
    IMAGE: 5 * 1024 * 1024 // no larger than 5MB for images
};

module.exports.acceptedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/tiff',
    'image/svg+xml'
];

// Directories used to upload the various files
module.exports.directory = {
    PRODUCTS: 'products',
    PRODUCT_TYPES: 'productTypes',
    CATEGORIES: 'categories',
    USERS: 'users'
};

module.exports.maxUploads = {
    PRODUCT_IMAGES: 5,
    PRODUCT_VARIANT_IMAGES: 2,
    CATEGORY_IMAGES: 1,
    USER_IMAGES: 1
};