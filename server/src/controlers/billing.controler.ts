import { Request,Response,NextFunction } from "express";
import { db } from "../db/db_connect";
import { credits, plans, storage, } from "../db/schema";
import { eq } from "drizzle-orm";
import AppError from "../utils/AppError";

export const getCurrentPlanCredit = async (req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try {
       

        const {accountId} = req.params

        const [ourCredits] = await db.select().from(credits).where(eq(credits.accountId,accountId));
        if (!ourCredits) {
            return res.status(404).json({
            success: false,
            message: "No credits found for this account"
            });
        }
        const planInfoData = await db.select().from(plans).where(eq(plans.planId,ourCredits.planId)).limit(1)
        const plan = planInfoData[0];
        const storageData = await db.select().from(storage).where(eq(storage.accountId,accountId)).limit(1)
       

        res.status(200).json({
            success: true,
            data: {planInfo:plan,ourCredits,storageData:storageData[0]}
        });


    } catch (error) {
        console.log(error)
        // Pass error to error handling middleware
        next(new AppError('Error to fetching credits point',500));
    }
}