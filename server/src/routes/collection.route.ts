import express from "express";
import { createCollection, deleteCollection, getAllCollections, updateCollection,addItemToCollection, getItemsOfCollection, deleteItemFromCollection } from "../controlers/collection.controler";
import authMiddleware from "../middlewares/auth.middleware";

 const route = express.Router();


route.get('/get-all-collection',authMiddleware,getAllCollections);
route.post('/create-collection',authMiddleware,createCollection);
route.delete('/delete-collection/:collectionId',authMiddleware,deleteCollection);
route.patch('/update-collection/:collectionId',authMiddleware,updateCollection);
route.post('/add-itemInto-collection',authMiddleware,addItemToCollection);
route.get('/get-itemOf-collection/:collectionId',authMiddleware,getItemsOfCollection);
route.delete('/delete-itemFrom-collection/:collectionId/:resourceId',authMiddleware,deleteItemFromCollection);




 export default route;