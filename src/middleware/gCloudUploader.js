const UploadConfig = require('../config/uploads');
const GCloudConfig = require('../config/gcloud');

const {
    Storage
} = require('@google-cloud/storage');
const storage = new Storage({
    projectId: GCloudConfig.GCLOUD_PROJECT
});

const bucket = storage.bucket(GCloudConfig.CLOUD_BUCKET);

const Multer = require('multer');

const ErrorMessages = require('../lang/errorMessages');

const uploadFilter = (req, file, callback) => {
    // Check if the uploaded file is of a valid MIME type ~ Proceed to upload if so
    if (UploadConfig.acceptedTypes.includes(file.mimetype)) {
        callback(null, true);
    } else { //Invalid mime type ~ Do not upload
        callback(new Error(ErrorMessages.invalidMimeType()), false);
    }
};

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: UploadConfig.sizeLimits.IMAGE
    },
    fileFilter: uploadFilter
});

// Get the public url of the file
function getPublicUrl(filename) {
    return `https://storage.googleapis.com/${GCloudConfig.CLOUD_BUCKET}/${filename}`;
}

function sendUploadToGCS(req, res, next) {
    console.log(req);
    if (!req.file) {
        return next();
    }

    const gcsname = Date.now() + req.file.originalname; //TODO: Change this into a random name
    const file = bucket.file(gcsname);

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        },
        resumable: false
    });

    stream.on('error', (err) => {
        req.file.cloudStorageError = err;
        next(err);
    });

    stream.on('finish', () => {
        req.file.cloudStorageObject = gcsname;
        file.makePublic().then(() => {
            req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
            next();
        });
    });

    stream.end(req.file.buffer);
}

module.exports = {
    getPublicUrl,
    sendUploadToGCS,
    multer
};