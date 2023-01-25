const fs = require('fs');
/* Saving One File on Server Directory */
const saveFile = async (req, res, next) => {
    if (req.files && req.files.file) {
        let file = req.files.file;
        let filename = new Date().valueOf() + "_" + file.name;
        file.mv(`./storage/${filename}`);
        req.body["image"] = filename;
        next();
    } else {
        next(new Error("Request File does not exist"));
    }
};

/* Patching One File Replace on Server Directory */
const patchFile = async (req, res, next) => {
    if (req.files && req.files.file) {
        let file = req.files.file;
        let filename = new Date().valueOf() + "_" + file.name;
        file.mv(`./storage/${filename}`);
        req.body["image"] = filename;
        next();
    } else {
        next();
    }
};

/* Saving Mutiple Files on Server Directory */
const saveFiles = async (req, res, next) => {
    if(req.files && req.files.files) {
        let filenames = [];
        let files = req.files.files;
        files.forEach((file) => {
            let filename = new Date().valueOf() + '_' + file.name;
            file.mv(`./storage/${filename}`);
            filenames.push(filename);
        })
        req.body["images"] = filenames;
        next();
    } else {
        next(new Error("Request Files not exist"));
    }
}

/* Deleting File on Server Directory */
const deleteFile = async (filename) => {
    await fs.unlinkSync(`./storage/${filename}`);
}

module.exports = {
    saveFile,
    patchFile,
    saveFiles,
    deleteFile
};