import express from "express";

const route = express.Router();

import {  forgetPassword, resetPassword, userLogin, userRegister } from "../controlers/auth.controler";

route.post('/login',userLogin)
route.post('/register',userRegister)
route.post('/forget-password',forgetPassword);
route.post('/reset-password',resetPassword);





export default route;
