const mongoose = require('mongoose');

const policyInfoSchema = new mongoose.Schema({
    policyNumber: { type: String, required: true },
    policyStartDate: { type: Date, required: true },
    policyEndDate: { type: Date, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'PolicyCategory', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'PolicyCarrier', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const PolicyInfo = mongoose.model('PolicyInfo', policyInfoSchema);

module.exports = PolicyInfo;
