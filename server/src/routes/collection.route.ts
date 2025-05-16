import express from "express";
import { createCollection, deleteCollection, getAllCollections } from "../controlers/collection.controler";
import authMiddleware from "../middlewares/auth.middleware";

 const route = express.Router();


route.get('/get-all-collection',authMiddleware,getAllCollections);
route.post('/create-collection',authMiddleware,createCollection);
route.post('/delete-collection/:collectionId',authMiddleware,deleteCollection);




 export default route;