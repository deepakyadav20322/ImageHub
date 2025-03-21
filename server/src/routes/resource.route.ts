import express from 'express'

import {findAndOptimizeReourse, getAllResources, uploadResources} from '../controlers/resource.controler'
import authMiddleware from '../middlewares/auth.middleware';
import { authenticateApiKey } from '../middlewares/authenticateApiKey.middleware';
import multer from 'multer';
import { determineAuthType } from '../middlewares/DetermineRequestAuthType.middleware';
const router  = express.Router();

const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 } // 5MB limit
}).single('file');


// router.get('/',getAllResources);
router.post('/upload',determineAuthType,authMiddleware,authenticateApiKey,upload,uploadResources);
router.get('/image/*',determineAuthType,authMiddleware,authenticateApiKey,findAndOptimizeReourse);








export default router;