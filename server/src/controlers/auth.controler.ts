import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import {
  users,
  accounts,
  roles,
  rolePermissions,
  permissions,
  apiKeys,
  resources,
  PasswordResetToken,
} from "../db/schema";
import { db } from "../db/db_connect";
import { and, eq, gt, sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import { generateJWTtoken } from "../utils/JwtTokenHandler";
import { generateApiKey, generateApiSecret } from "../utils/apiKeyHandler";
import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { date } from "drizzle-orm/mysql-core";
import { sendMail } from "../utils/mailer";
import { passwordResetTemplate } from "../utils/passwordResetMailTemplate";

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("login controller me kuchh to aaya hai .....");
    const { email, password } = req.body;

    //👉 check that user login with google then it take as wok or not because when we login with google then password not come (??Todo:)

    if (!email || !password) {
      return next(new AppError("Email and password required", 400));
    }
    // here user return as array => user[0]
    // const user = await db
    //   .select({
    //     userId: users.userId,
    //     firstName: users.firstName,
    //     lastName: users.lastName,
    //     email: users.email,
    //     password: users.password,
    //     emailVerified: users.emailVerified,
    //     googleId: users.googleId,
    //     accountId: users.accountId,
    //     invitedBy: users.invitedBy,
    //     product_environment: users.product_environments,
    //     refresh_token: users.refresh_token,
    //     userType: users.userType,
    //     userStatus: users.userStatus,
    //     createdAt: users.createdAt,
    //     updatedAt: users.updatedAt,
    //     lastLogin: users.lastLogin,
    //     role: {
    //       roleId: roles.roleId,
    //       roleName: roles.name,
    //       // roleDescription: roles.description,
    //     },
    //   })
    //   .from(users)
    //   .leftJoin(roles, eq(roles.roleId, users.roleId))
    //   .where(sql`${users.email} = ${email}`)
    //   .limit(1);

    const user = await db
      .select({
        userId: users.userId,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        password: users.password,
        emailVerified: users.emailVerified,
        googleId: users.googleId,
        accountId: users.accountId,
        invitedBy: users.invitedBy,
        product_environment: users.product_environments,
        refresh_token: users.refresh_token,
        userType: users.userType,
        userStatus: users.userStatus,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastLogin: users.lastLogin,
        role: {
          roleId: roles.roleId,
          roleName: roles.name,
          roleDescription: roles.description, // Corrected: Added missing role description
        },
      })
      .from(users)
      .leftJoin(roles, eq(roles.roleId, users.roleId))
      .where(eq(users.email, email))
      .limit(1);

    const rolePermissionsData = user[0]?.role?.roleId
      ? await db
        .select({
          permission:
            sql`${permissions.resource} || ':' || ${permissions.action}`.as(
              "permission"
            ),
        })
        .from(rolePermissions)
        .leftJoin(
          permissions,
          eq(rolePermissions.permissionId, permissions.permissionId)
        )
        .where(eq(rolePermissions.roleId, user[0].role.roleId))
      : [];

    const formattedPermissions = rolePermissionsData.map(
      (perm) => perm.permission
    );
    // ========================= Add query here ==================>

    if (!user || user.length === 0 || !user[0].password) {
      return next(new AppError("Invalid email or password", 401));
    }
    let password_check = await bcrypt.compare(password, user[0].password);
    if (!password_check) {
      return next(new AppError("Invalid email or password", 401));
    }

    if (user[0].emailVerified) {
      return next(new AppError("Email not verified", 401));
    }

    // remove password from user object
    const { password: _, googleId, refresh_token, ...safeUser } = user[0];
    // token generation
    const accessToken = generateJWTtoken(safeUser);
    const refreshToken = generateJWTtoken(safeUser);

    // Update last login timestamp and store the user refresh token

    await db
      .update(users)
      .set({ lastLogin: new Date(), refresh_token: refreshToken })
      .where(sql`${users.email} = ${email}`);

    // 👉 Todo: try to minimize these multiple query into less query.(try to merge multiple simple query to one better query)
    // Get all buckets for the user's account
    const buckets = await db
      .select({
        bucketName: resources.name,
        bucketType: resources.type,
        bucketPath: resources.path,
      })
      .from(resources)
      .where(eq(resources.accountId, safeUser.accountId));

    res.status(200).json({
      status: "success",
      data: {
        message: "Login successful",
        user: safeUser,
        token: accessToken,
        permissions: formattedPermissions,
        resourcesEnvironment: buckets,
      },
    });
  } catch (error) {
    console.log(error);
    return next(new AppError("Something went wrong", 500));
  }
};

// export const userRegister = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   try {
//     //👉 when person login with google then not need of password and those logic handle in gogole login file(??Todo:)that request not come here-
//     // 👉 This controler work  when user regiter form my website directally it is not for invited user(-----)
//     console.log(req.body);

//     const { firstName, lastName, email, password } = req.body;

//     if (!firstName || !lastName || !email || !password) {
//       return next(new AppError("Missing required fields", 400));
//     }
//     const hashPassword = await bcrypt.hash(password, 10);
//     const newAccount = await db.insert(accounts).values({}).returning();
//     const accountId = newAccount[0].accountId;
//     // Get the super_admin role ID
//     const roleResult = await db
//       .select()
//       .from(roles)
//       .where(sql`${roles.name} = ${"super_admin"}`)
//       .limit(1);

//     if (!roleResult || roleResult.length === 0) {
//       return next(new AppError("Default role not found", 500));
//     }

//     const roleId = roleResult[0].roleId;
//     // Create the user with the generated accountId
//     const newUser = await db
//       .insert(users)
//       .values({
//         firstName,
//         lastName,
//         email,
//         password: hashPassword,
//         accountId, // Link user with account
//         roleId: roleId, // Add default role id(super_admin) for new users with account(organization)
//       })
//       .returning();

//     // It create api key and secret and save into db
//     // Todo: optimize with add this quey with above queris(try to avoid the multiple db quries in signup)
//     await db.insert(apiKeys).values({
//       accountId: newAccount[0].accountId,
//       apiKey: generateApiKey(),
//       apiSecret: generateApiSecret(), // it is hashd value
//     });

//     res.status(201).json({
//       success: true,
//       message: "user register successfully",
//       data: newUser[0],
//     });
//   } catch (error) {
//     return next(new AppError("Something went wrong", 500));
//   }
// };

// it is used to return the role and permission for authenticate the all api routes

export const getUserPermissions = async (userId: string) => {
  const userWithRole = await db
    .select({
      roleId: users.roleId,
      roleName: roles.name,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.roleId))
    .where(eq(users.userId, userId))
    .limit(1);

  if (!userWithRole.length) return null;

  const { roleId, roleName } = userWithRole[0];

  const userPermissions = await db
    .select({ action: permissions.action, resource: permissions.resource })
    .from(rolePermissions)
    .innerJoin(
      permissions,
      eq(rolePermissions.permissionId, permissions.permissionId)
    )
    .where(eq(rolePermissions.roleId, roleId));

  return {
    role: roleName,
    permissions: userPermissions.map((p) => `${p.resource}:${p.action}`), // e.g., ["product:create", "user:delete"]
  };
};

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// 👉Todo: when we create user then in terminal it give:-
// Are you using a Stream of unknown length as the Body of a PutObject request? Consider using Upload instead from @aws-sdk/lib-storage.

export const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return next(new AppError("Missing required fields", 400));
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Start a transaction
    await db.transaction(async (tx) => {
      // Create a new account
      const newAccount = await tx.insert(accounts).values({}).returning();
      const accountId = newAccount[0].accountId;

      // Get the super_admin role ID
      const roleResult = await tx
        .select()
        .from(roles)
        .where(sql`${roles.name} = ${"super_admin"}`)
        .limit(1);

      if (!roleResult || roleResult.length === 0) {
        throw new AppError("Default role not found", 500);
      }

      const roleId = roleResult[0].roleId;

      // ----------------------------
      // 🔹 Create S3 Buckets in AWS
      // ----------------------------

      // const originalBucketName = `q455${Date.now()}s`;
      // const transformedBucketName = `r${545231321}t`;
      const originalBucketName = `${accountId}-original`;
      const transformedBucketName = `${accountId}-transformed`;
      try {
        // Create the original bucket
        await s3Client.send(
          new CreateBucketCommand({
            Bucket: originalBucketName,
          })
        );

        // Create the transformed bucket
        await s3Client.send(
          new CreateBucketCommand({
            Bucket: transformedBucketName,
          })
        );

        // 🔹 Create the default folder inside the original bucket
        await s3Client.send(
          new PutObjectCommand({
            Bucket: originalBucketName,
            Key: "default/", // S3 treats keys ending with '/' as folders
            Body: "",
          })
        );

        // 🔹 Create the default folder inside the transformed bucket
        await s3Client.send(
          new PutObjectCommand({
            Bucket: transformedBucketName,
            Key: "default/", // S3 treats keys ending with '/' as folders
            Body: "",
          })
        );
      } catch (s3Error: any) {
        throw new AppError(
          `Failed to create S3 bucket: ${s3Error.message}`,
          500
        );
      }

      // Create two buckets in db which is created in s3 (original and transformed) for the new account
      const OriginalBucket = await tx
        .insert(resources)
        .values({
          accountId,
          type: "bucket",
          name: originalBucketName,
          parentResourceId: null, // Top-level resource
          metadata: {}, // Additional metadata if needed
          path: "/original",
        })
        .returning();

      // const TransformedBucket = await tx
      //   .insert(resources)
      //   .values({
      //     accountId,
      //     type: "bucket",
      //     name: transformedBucketName,
      //     parentResourceId: null, // Top-level resource
      //     metadata: {}, // Additional metadata if needed,
      //     path: "/transformed/",
      //   })
      //   .returning();

      // Extract resource IDs from the inserted bucket records
      const originalBucketResourceId = OriginalBucket[0].resourceId;
      // const transformedBucketResourceId = TransformedBucket[0].resourceId;

      // 🔹 Insert 'default' folder inside the Original bucket in DB
      const defaultFolderOriginal = await tx
        .insert(resources)
        .values({
          accountId,
          type: "folder",
          name: "default",
          parentResourceId: originalBucketResourceId, // Inside Original bucket
          path: "/original/default",
        })
        .returning();

      // Define the cloud display names for product environments
      const productEnvironments = [
        originalBucketResourceId, // Cloud Id / Cloud display name (original bucket)
        // transformedBucketResourceId, // Cloud Id / Cloud display name (transformed bucket)
      ];

      // Create the user with the generated accountId
      const newUser = await tx
        .insert(users)
        .values({
          firstName,
          lastName,
          email,
          password: hashPassword,
          accountId,
          roleId,
          product_environments: productEnvironments,
        })
        .returning();

      // Create API key and secret for the account
      await tx.insert(apiKeys).values({
        accountId,
        apiKey: generateApiKey(),
        apiSecret: generateApiSecret(), // Hashed value
      });

      // Commit the transaction
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: newUser[0],
          DBbuckets: {
            public: OriginalBucket[0],
            // private: TransformedBucket[0],
          },
          s3Buckets: {
            original: originalBucketName,
            transformed: transformedBucketName,
          },
        },
      });
    });
  } catch (error) {
    console.log(error);
    return next(
      new AppError("Something went wrong during user registration ", 500)
    );
  }
};



export const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email } = req.body;
    console.log(req.body)

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Find user
    const user = await db
      .select({
        userId: users.userId,
        email: users.email,
        accountId: users.accountId, // Assuming `users` table has accountId FK
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email',
      });
    }

    const currentUser = user[0];

    // Generate reset token (JWT or UUID-based string)
    const resetToken = generateJWTtoken({ userId: currentUser.userId, accountId: currentUser.accountId, email: currentUser.email }, 15 * 60); // 15 mins

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // Upsert token (if same user already requested reset, update token)
    await db
      .insert(PasswordResetToken)
      .values({
        userId: currentUser.userId,
        accountId: currentUser.accountId,
        email: currentUser.email,
        token: resetToken,
        expiresAt,
      })
      .onConflictDoUpdate({
        target: [PasswordResetToken.userId, PasswordResetToken.accountId],
        set: {
          token: resetToken,
          expiresAt,
        },
      });

    // TODO: Send reset email with token link
    await sendMail({
      to: currentUser.email,
      subject: 'Reset your password',
      html: passwordResetTemplate(resetToken),
    });

    // e.g., https://yourapp.com/reset-password?token=${resetToken}

    res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to your email.',
      // resetToken, // Only for dev/testing, remove in prod
    });
  } catch (error) {
    console.error('[FORGOT_PASSWORD_ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};


export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { token, password } = req.body;
  console.log(token,password)
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }

    // 1. Validate token from DB
    const tokenData = await db
      .select()
      .from(PasswordResetToken)
      .where(
        and(
          eq(PasswordResetToken.token, token),
          gt(PasswordResetToken.expiresAt, new Date()) // token not expired
        )
      )
      .limit(1);

    if (!tokenData || tokenData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    const { userId, accountId } = tokenData[0];

    // 2. Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Update user's password
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(
        and(
          eq(users.userId, userId as string),
          eq(users.accountId, accountId as string)
        )
      );

    // 4. Delete used token
    await db
      .delete(PasswordResetToken)
      .where(
        and(
          eq(PasswordResetToken.token, token),
          eq(PasswordResetToken.userId, userId),
          accountId ? eq(PasswordResetToken.accountId, accountId) : undefined
        )
      );

    return res.status(200).json({
      success: true,
       data:{  message: 'Password has been reset successfully',}
    });
  } catch (error) {
    console.error('[RESET_PASSWORD_ERROR]', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};