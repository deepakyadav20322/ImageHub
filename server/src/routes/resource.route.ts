import express, { Request, Response } from 'express'

import  {findAndOptimizeReourse, getAllBucketsForAccount, getAllResources, getAssetsOfParticularFolder, getCurrentFoldersWithAllParents, uploadResources,createFolder, getAllFoldersDataByAccountId, getRootFolderOfBucketOfAccount} from '../controlers/resource.controler'
import authMiddleware from '../middlewares/auth.middleware';
import { authenticateApiKey } from '../middlewares/authenticateApiKey.middleware';
import multer from 'multer';
import { determineAuthType } from '../middlewares/DetermineRequestAuthType.middleware';
const router  = express.Router();

const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 } // 5MB limit
}).single('file');


// router.get('/',getAllResources);

// router.post('/:bucket_name/:resource_type/upload',determineAuthType,authMiddleware,authenticateApiKey,upload,uploadResources);
router.post('/:bucket_name/:resource_type/upload',upload,uploadResources);
router.get('/image/*',determineAuthType,authMiddleware,authenticateApiKey,findAndOptimizeReourse);
router.get('/get-all-environments/:accountId',authMiddleware,getAllBucketsForAccount);
router.get('/folders/:folderId',authMiddleware,getAllFoldersDataByAccountId); 
router.get('/folders/:folderId/assets',authMiddleware,getAssetsOfParticularFolder); 
router.post('/folders/create-folder',authMiddleware,createFolder);
router.get('/folders/getfolderAId/:accountId',authMiddleware,getAllFoldersDataByAccountId);
router.get('/folders/root-folder/:bucketId',authMiddleware,getRootFolderOfBucketOfAccount);
// router.post('/folders/create-folder',async(req,res)=>{
//     try{
//         const body = req.body
//         res.json({data:body,success:true})

//     }catch(error){
// console.log("create folder error");
//     }
// });








export default router;