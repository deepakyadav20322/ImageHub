import express, { Request, Response, NextFunction } from "express";
import { Router } from "express";

const route = express.Router();

import {  userLogin, userRegister } from "../controlers/auth.controler";

route.post('/login',userLogin)
route.post('/register',userRegister)





export default route;
