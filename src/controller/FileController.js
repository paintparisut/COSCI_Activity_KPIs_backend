const multer = require('multer');
const Files = require('../models/file_schema');

const storageImg = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/')
    },
    filename: (req, file, cb) => {
        cb(null, currentTime + '-' + file.originalname)
    }
});
exports.uploadImage = async (req,res) => {
    const user_id = req.userId
    // const user_id = 'doFavorAdminId'
    const uploadImg = multer({storage: storageImg}).array('file');

    uploadImg( req, res, async (err) => {
        if (err) {
            return res.status(500).json(err)
        }

        const file_arr = []
        for(let i = 0 ; i < req.files.length ; i++){
            const file_data = {
                file_name: req.files[i].originalname,
                filename_extension: req.files[i].mimetype,
                file_path: req.files[i].path,
                file_author_id: user_id,
            }
            file_arr.push(file_data)
        }

        const data = await Files.create(file_arr)
        const data_id = data.map(key => {
            return key._id
        });

        return res.status(200).json({result: 'OK', message: 'success upload image', data: data_id})
    });
};
