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