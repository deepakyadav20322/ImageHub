import express from "express";
import { getCurrentCreditInfo, getCurrentPlan, getCurrentPlanCredit } from "../controlers/billing.controler";
const route = express.Router();

route.get('/all-data-current-plan/:accountId',getCurrentPlanCredit);
route.get('/plan/:accountId',getCurrentPlan);
route.get('/plan/:accountId',getCurrentCreditInfo);




export default route