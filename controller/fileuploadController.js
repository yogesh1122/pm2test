// Import necessary libraries
const xlsx = require('xlsx'); // For parsing XLSX files
const csv = require('csv-parser'); // For parsing CSV files
const fs = require('fs');

// Import your Mongoose models
const Agent = require('../model/agentModel');
const User = require('../model/userModel');
const Account = require('../model/accountModel');
const PolicyCategory = require('../model/policyCategoryModel');
const PolicyCarrier = require('../model/policyCarrierModel');
const PolicyInfo = require('../model/policyInfoModel');
const Post = require('../model/messageModel');


// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// Set up multer for file upload
exports.filesUpload = async (req, res) => {
    // Check if files exist
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    try {
        // Process each uploaded file
        for (const file of req.files) {
            // Determine file extension (xlsx or csv)
            const fileExtension = file.originalname.split('.').pop();

            // Parse file based on extension
            let data;
            if (fileExtension === 'xlsx') {
                const workbook = xlsx.readFile(file.path);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                data = xlsx.utils.sheet_to_json(worksheet);
            } else if (fileExtension === 'csv') {
                data = [];
                await new Promise((resolve, reject) => {
                    fs.createReadStream(file.path)
                        .pipe(csv())
                        .on('data', (row) => {
                            data.push(row);
                        })
                        .on('end', () => {
                            console.log('CSV file successfully processed');
                            resolve();
                        })
                        .on('error', (error) => {
                            reject(error);
                        });
                });
            } else {
                return res.status(400).send('Unsupported file format.');
            }

            // Process and save data to MongoDB
            for (const item of data) {
                // Save agent data
                const agent = await Agent.create({ agentName: item.agent });

                // Save user data
                const user = await User.create({
                    firstname: item.firstname,
                    dob: new Date(item.dob), // Convert dob to Date object
                    address: item.address,
                    phone : item.phone , // Assuming this field exists in your schema
                    state: item.state, // Assuming this field exists in your schema
                    zip: item.zip, // Assuming this field exists in your schema
                    email: item.email, // Assuming this field exists in your schema
                    gender: item.gender, // Assuming this field exists in your schema
                    userType: item.userType // Assuming this field exists in your schema
                });

                // Save account data
                const account = await Account.create({ accountName: item.account_name });

                // Save policy category data
                const policyCategory = await PolicyCategory.create({ categoryName: item.category_name });

                // Save policy carrier data
                const policyCarrier = await PolicyCarrier.create({ companyName: item.company_name });

                // Save policy info data and establish relationships
                const policyInfo = await PolicyInfo.create({
                    policyNumber: item.policy_number,
                    policyStartDate: new Date(item.policy_start_date), // Convert start date to Date object
                    policyEndDate: new Date(item.policy_end_date), // Convert end date to Date object
                    categoryId: policyCategory._id,
                    companyId: policyCarrier._id,
                    userId: user._id,
                    accountId: account._id,
                    agentId: agent._id
                });

                // Update user with policy info
                await User.findByIdAndUpdate(user._id, { $addToSet: { policies: policyInfo._id } });
            }

            // Remove uploaded file
            fs.unlinkSync(file.path);
        }

        res.status(200).send('Data uploaded and saved successfully.');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Internal Server Error');
    }
};
exports.policyInfo = async (req, res) => {
        try {
            const email = req.params.email;
            // Find the user with the provided email
            const user = await User.findOne({ email });
    
            if (!user) {
                return res.status(404).send('User not found.');
            }
            console.log('user',user);
            // Find policy info associated with the user
            const policyInfo = await PolicyInfo.find({ userId: user._id });
    
            res.status(200).json(policyInfo);
        } catch (error) {
            console.error('Error searching policy info:', error);
            res.status(500).send('Internal Server Error');
        }
}

exports.aggregateDatafun = async (req, res) => {
    try {
        // Aggregate policy info by user
        const aggregatedPolicyByUser = await PolicyInfo.aggregate([
            {
                $lookup: {
                    from: 'users', // Assuming the collection name for User model is 'users'
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $group: {
                    _id: '$userId',
                    user: { $first: '$user' },
                    policyCount: { $sum: 1 }
                    // You can include more aggregation operations as needed
                }
            },
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    userName: '$user.firstname', // Assuming you have a field named 'firstName' in the User schema
                    email:'$user.email',
                    policyCount: 1
                    // You can include more fields as needed
                }
            }
        ]);

        res.status(200).json(aggregatedPolicyByUser);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

exports.message = async (req, res) => {
    try {
      const { message, day, time } = req.body;
      const post = new Post({ message, day, time });
      await Post(post).save();
      res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };