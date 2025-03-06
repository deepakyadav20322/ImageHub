import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import { users, accounts, roles } from "../db/schema";
import { db } from "../db/db_connect";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import { generateJWTtoken } from "../utils/JwtTokenHandler";

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, password } = req.body;

    //👉 check that user login with google then it take as wok or not because when we login with google then password not come (??Todo:)

    if (!email || !password) {
      return next(new AppError("Email and password required", 400));
    }
    // here user return as array => user[0]
    const user = await db
      .select({
        userId: users.userId,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        password: users.password,
        emailVerified:users.emailVerified,
        googleId: users.googleId,
        accountId: users.accountId,
        roleId: users.roleId,
        invitedBy:users.invitedBy,
        product_environment:users.product_environments,
        // refresh_token: users.refresh_token,
        userType: users.userType,
        userStatus: users.userStatus,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastLogin: users.lastLogin,
        role: {
          roleId: roles.roleId,
          roleName: roles.name,
          // roleDescription: roles.description,
        },
      })
      .from(users)
      .leftJoin(roles, eq(roles.roleId, users.roleId))
      .where(sql`${users.email} = ${email}`)
      .limit(1);

    if (!user || user.length === 0 || !user[0].password) {
      return next(new AppError("Invalid email or password", 401));
    }
    let password_check = await bcrypt.compare(password, user[0].password);
    if (!password_check) {
      return next(new AppError("Invalid email or password", 401));
    }

    if( (user[0].emailVerified) ){
      return next(new AppError("Email not verified", 401));
    }

    // Update last login timestamp

    await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(sql`${users.email} = ${email}`);

    const { password: _, googleId, ...safeUser } = user[0];
    const token = generateJWTtoken(safeUser);

    return res.status(200).json({
      status: "success",
      data: {
        message: "Login successful",
        user: safeUser,
        token,
      },
    });
  } catch (error) {
    return next(new AppError("Something went wrong", 500));
  }
};

export const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    //👉 when person login with google then not need of password and those logic handle in gogole login file(??Todo:)that request not come here-
    // 👉 This controler wok  when user regiter form my website directally it is not for invited user(-----)
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email) {
      return next(new AppError("Missing required fields", 400));
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newAccount = await db.insert(accounts).values({}).returning();
    const accountId = newAccount[0].accountId;
    // Get the super_admin role ID
    const roleResult = await db
      .select()
      .from(roles)
      .where(sql`${roles.name} = ${"super_admin"}`)
      .limit(1);

    if (!roleResult || roleResult.length === 0) {
      return next(new AppError("Default role not found", 500));
    }

    const roleId = roleResult[0].roleId;
    // Create the user with the generated accountId
    const newUser = await db
      .insert(users)
      .values({
        firstName,
        lastName,
        email,
        password:hashPassword,
        accountId, // Link user with account
        roleId: roleId, // Add default role id(super_admin) for new users with account(organization)
      })
      .returning();
      

    res.status(201).json({ success: true,message:"user register successfully", data: newUser[0] });
  } catch (error) {
    return next(new AppError("Something went wrong", 500));
  }
};
