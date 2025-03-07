import { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/db_connect";
import { users } from "../db/schema";
import AppError from "../utils/AppError";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<void> => {
  try {
    const allUsers = await db.select().from(users);
     res.status(200).json({
      success: true,
      count: allUsers.length,
      data: allUsers,
    });
  } catch (error) {
    next(new AppError("something went wrong in user getting",500));
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId))
      .limit(1);
    if (!user.length) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({ success: true, data: user[0] });
  } catch (error) {
    next(error);
  }
};

export const inviteUserCreation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const updatedUser = await db
      .update(users)
      .set(req.body)
      .where(eq(users.userId, userId))
      .returning();

    if (!updatedUser.length) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      data: updatedUser[0],
    });
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const deletedUser = await db
      .delete(users)
      .where(eq(users.userId, userId))
      .returning();
    if (!deletedUser.length) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser[0],
    });
  } catch (error) {
    next(error);
  }
};
