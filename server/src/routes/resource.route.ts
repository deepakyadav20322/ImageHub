import express from 'express'

import {getAllResources} from '../controlers/resource.controler'
const router  = express.Router();


router.get('/',getAllResources);










export default router;