const mongoose = require('mongoose');

const UserSchema  = new mongoose.Schema({
    username: {type: String, requrired: true, unique: true},
    password: {type: String, requrired: true}
    },
    {collection: 'users'}
)


const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;