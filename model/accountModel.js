const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    accountName: { type: String, required: true }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
