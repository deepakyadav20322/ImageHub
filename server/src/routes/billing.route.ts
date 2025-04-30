import express from "express";
import { getCurrentPlanCredit } from "../controlers/billing.controler";
const route = express.Router();

route.get('/plan/:all-data-current-plan',getCurrentPlanCredit);
// route.get('/plan/:accountId',getCurrentPlan);




export default route