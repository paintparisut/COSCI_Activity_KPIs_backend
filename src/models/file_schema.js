const mongoose = require('mongoose');

//Upload file -> create schema -> add file schema to schema that needed (optional_file, file_result)

const schema = mongoose.Schema({
    file_name: String,
    filename_extension: String,
    file_path: String,
    file_author_id: String,
    created: { type: Date, default: Date.now }
});


module.exports = mongoose.model('files', schema)