// const user = require("../routes/userRoutes")
const uploadFilesRoutes = require("../routes/uploadFileRoutes")

module.exports= (app) =>
{
   app.use('/api/file',uploadFilesRoutes) 
 
 
}