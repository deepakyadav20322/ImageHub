import express, { Request, Response } from 'express'

import  {findAndOptimizeResource, getAllBucketsForAccount, getAllResources, getAssetsOfParticularFolder, getCurrentFoldersWithAllParents, uploadResources,createFolder, getAllFoldersDataByAccountId, getRootFolderOfBucketOfAccount, deleteFolderOfBucketWhithAllChildItems, uploadResourcess, deleteSingleAsset, getAllAssetsOfParticularAccount, AddTagsOnResourceFile, getAllTagsOfAccount, toggleApiKeyStatus, deleteApiKeyById, createApiKeyAndSecret, getAllApiKeys, updateApiKeyName} from '../controlers/resource.controler'
import authMiddleware from '../middlewares/auth.middleware';
import { authenticateApiKey } from '../middlewares/authenticateApiKey.middleware';
import multer from 'multer';
import { determineAuthType } from '../middlewares/DetermineRequestAuthType.middleware';
import { checkWithTransformOrNot } from '../middlewares/checkTransFormationOrNot.middleware';
import { handleUploadMulterErrors } from '../middlewares/handleMulterError.middleware';
const router  = express.Router();

// const upload = multer({
//     limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
// }).array('files', 10); // 'files' is the field name, 10 is the maximum number of files

const upload = multer({
    limits: { fileSize: 5* 1024 * 1024 }, // 5MB limit
    fileFilter: (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        // Optional: Add file type filtering if needed
        if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp|avif)$/)) {
            cb(new Error('Only image files are allowed!'));
            return;
        }
        cb(null, true);
    }
}).array('files', 1); // 'files' is the field name, 10 is the maximum number of files

// router.get('/',getAllResources);

// router.post('/:bucket_name/:resource_type/upload',determineAuthType,authMiddleware,authenticateApiKey,upload,uploadResources);
router.post('/:bucket_name/:resource_type/upload',authMiddleware,upload,handleUploadMulterErrors,uploadResourcess);
// Route 1: With and without transformation by middleware 
// router.get('/:bucket/image/upload/:transformations?/:path(*)',checkWithTransformOrNot,findAndOptimizeResource);
router.get('/:bucket/image/upload/:path(*)',checkWithTransformOrNot,findAndOptimizeResource);

// router.get('/:bucket/image/upload/:transformations/:path(*)',determineAuthType,authMiddleware,authenticateApiKey,findAndOptimizeResource);
router.get('/get-all-environments/:accountId',authMiddleware,getAllBucketsForAccount);
router.get('/folders/:folderId',authMiddleware,getAllFoldersDataByAccountId); 
router.get('/folders/:folderId/assets',authMiddleware,getAssetsOfParticularFolder); 
router.post('/folders/create-folder',authMiddleware,createFolder);
router.get('/folders/getfolderAId/:accountId',authMiddleware,getAllFoldersDataByAccountId);
router.get('/folders/root-folder/:bucketId',authMiddleware,getRootFolderOfBucketOfAccount);
router.delete('/folders/delete-folder/:bucketId/:folderId',authMiddleware, deleteFolderOfBucketWhithAllChildItems);

router.delete('/folder/delete-asset/:bucketId/:folderId/:assetId',authMiddleware,deleteSingleAsset);
router.get('/:bucketId/:accountId/getAll-assets',authMiddleware,getAllAssetsOfParticularAccount);
router.post('/:bucketId/addtags/:resourceId/',authMiddleware,AddTagsOnResourceFile);
router.get('/:bucketId/getAllTags',authMiddleware,getAllTagsOfAccount);
router.post('/create-apiKey',authMiddleware,createApiKeyAndSecret);
router.delete('/delete-apiKey/:apiKeyId',authMiddleware,deleteApiKeyById);
router.put('/toggle-api-key',authMiddleware,toggleApiKeyStatus);
router.get('/get-apiKey',authMiddleware,getAllApiKeys);
router.patch('/update-apiKey/:apiKeyId',authMiddleware,updateApiKeyName);






// router.post('/folders/create-folder',async(req,res)=>{
//     try{
//         const body = req.body
//         res.json({data:body,success:true})

//     }catch(error){
// console.log("create folder error");
//     }
// });








export default router;