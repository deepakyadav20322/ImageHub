import express from "express";

const route = express.Router();

import {  checkEmailAvailability, forgetPassword, getAllRole, resetPassword, userLogin, userRegister } from "../controlers/auth.controler";
import authMiddleware from "../middlewares/auth.middleware";

route.post('/login',userLogin)
route.post('/register',userRegister)
route.post('/forget-password',forgetPassword);
route.post('/reset-password',resetPassword);
route.post('/check-email-availability',checkEmailAvailability);
route.get('/get-all-role',authMiddleware,getAllRole)





export default route;
