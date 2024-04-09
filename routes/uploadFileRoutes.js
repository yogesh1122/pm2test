const multer = require('multer');
const express = require("express");
const router = express.Router();
const {filesUpload, policyInfo, aggregateDatafun, message } = require("../controller/fileuploadController");
const upload = multer({ dest: 'uploads/' });


// router.get('/test',(req,res)=>{ res.send("WELCOME TO APP")});
router.post('/upload',upload.any(),filesUpload)
router.get('/policyinfo/:email',policyInfo)
router.get('/aggregatedPolicyByUser',aggregateDatafun)
router.post('/message',message)

module.exports = router;