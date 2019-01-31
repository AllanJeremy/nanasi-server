const UploadConfig = require('../config/uploads');
const GCloudConfig = require('../config/gcloud');

const Api = require('../lib/api');
const FeedbackMessages = require('../lang/feedbackMessages');

const STORAGE_URL = `https://storage.googleapis.com`;

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
    return `${STORAGE_URL}/${GCloudConfig.CLOUD_BUCKET}/${filename}`;
}

// Get the file name from the public URL
function getFileName(publicUrl) {
    return publicUrl.split(`${STORAGE_URL}/`)[1];
}

function sendUploadToGCS(req, res, next) {
    // If no file was provided
    if (!req.file) {
        const statusCode = 403;
        return res.status(statusCode).json(Api.getError(
            FeedbackMessages.operationFailed(`upload file. No file specified`),
            undefined,
            statusCode
        ));
    }

    let dir = req.uploadData.directory || '';

    // Set the directory if one has not yet been provided
    if (dir) {
        dir = dir ? `${dir}/` : '';
    } else {
        console.debug(`No directory provided, uploading to root directory`);
    }

    const gcsname = dir + (Date.now() + req.file.originalname); //TODO: Change this into a random name
    const file = bucket.file(gcsname);

    // Store the filename as part of the gcs object

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        },
        resumable: true
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

// Delete image from gcs
function deleteFromGCS(req, res, next) {
    const fileName = _getFileName(req.uploadData.imageUrl);

    bucket.file(fileName).delete((err, response) => {
        if (err) {
            return Api.getError(err.message, err);
        }

        // File successfully deleted
        next();
    });
}

module.exports = {
    getPublicUrl,
    sendUploadToGCS,
    deleteFromGCS,
    multer
};