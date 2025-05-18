import express from "express";
import { createCollection, deleteCollection, getAllCollections, updateCollection } from "../controlers/collection.controler";
import authMiddleware from "../middlewares/auth.middleware";

 const route = express.Router();


route.get('/get-all-collection',authMiddleware,getAllCollections);
route.post('/create-collection',authMiddleware,createCollection);
route.delete('/delete-collection/:collectionId',authMiddleware,deleteCollection);
route.patch('/update-collection/:collectionId',authMiddleware,updateCollection);




 export default route;