import express from "express";
import { createCollection, getAllCollections } from "../controlers/collection.controler";

 const route = express.Router();


route.get('/get-all-collection',getAllCollections);
route.post('/create-collection',createCollection);





 export default route;